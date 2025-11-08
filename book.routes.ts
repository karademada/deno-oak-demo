import { Router } from "@oak/oak";
import type { Book } from "./book.types.ts";
import {
  validateBody,
  createBookSchema,
  updateBookSchema,
} from "./validation.ts";
import { authMiddleware } from "./auth.middleware.ts";

const kv = await Deno.openKv();
const bookRouter = new Router();
bookRouter.prefix("/api/books");

async function getBookById(id: string): Promise<Book | null> {
  const result = await kv.get<Book>(["books", id]);
  return (result.value as Book) || null;
}

bookRouter
  .get("/:id", authMiddleware, async (ctx) => {
    try {
      const id = ctx.params.id!;
      const book = await getBookById(id);
      if (book) {
        ctx.response.body = book;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Book not found" };
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };
    }
  })
  .get("/", authMiddleware, async (ctx) => {
    try {
      const books: Book[] = [];
      for await (const entry of kv.list<Book>({ prefix: ["books"] })) {
        books.push(entry.value);
      }
      ctx.response.body = books;
    } catch (error) {
      console.error("Error fetching books:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };
    }
  })
  .post("/", authMiddleware, validateBody(createBookSchema), async (ctx) => {
    try {
      const body = await ctx.request.body.json();
      const id = crypto.randomUUID();
      const newBook: Book = { id, ...body };
      await kv.set(["books", id], newBook);
      ctx.response.status = 201;
      ctx.response.body = newBook;
    } catch (error) {
      console.error("Error creating book:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };
    }
  })
  .patch("/:id", authMiddleware, validateBody(updateBookSchema), async (ctx) => {
    try {
      const body = await ctx.request.body.json();
      const id = ctx.params.id!;
      const existingBook = await getBookById(id);
      if (!existingBook) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Book not found" };
        return;
      }
      const updatedBook: Book = { ...existingBook, ...body };
      await kv.set(["books", id], updatedBook);
      ctx.response.body = {
        message: "Book updated successfully",
        book: updatedBook,
      };
    } catch (error) {
      console.error("Error updating book:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };
    }
  })
  .delete("/:id", authMiddleware, async (ctx) => {
    try {
      const id = ctx.params.id!;
      const existingBook = await getBookById(id);
      if (!existingBook) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Book not found" };
        return;
      }
      await kv.delete(["books", id]);
      ctx.response.status = 204;
    } catch (error) {
      console.error("Error deleting book:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };
    }
  });
export default bookRouter;
