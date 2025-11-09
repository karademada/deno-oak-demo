import { Router } from "@oak/oak";
import { CreateBookUseCase } from "../../application/book/create-book.usecase.ts";
import { GetBooksUseCase } from "../../application/book/get-books.usecase.ts";
import { GetBookByIdUseCase } from "../../application/book/get-book-by-id.usecase.ts";
import { UpdateBookUseCase } from "../../application/book/update-book.usecase.ts";
import { DeleteBookUseCase } from "../../application/book/delete-book.usecase.ts";
import { authMiddleware } from "./auth.middleware.ts";
import { validateBody } from "./validation.middleware.ts";
import { createBookSchema, updateBookSchema } from "./validation.schemas.ts";
import { errorHandler } from "./error-handler.middleware.ts";

export class BookController {
  public router: Router;

  constructor(
    private readonly createBook: CreateBookUseCase,
    private readonly getBooks: GetBooksUseCase,
    private readonly getBookById: GetBookByIdUseCase,
    private readonly updateBook: UpdateBookUseCase,
    private readonly deleteBook: DeleteBookUseCase
  ) {
    this.router = new Router();
    this.router.prefix("/api/books");
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router
      .get("/", authMiddleware, errorHandler(async (ctx) => {
        const books = await this.getBooks.execute();
        ctx.response.body = books;
      }))
      .get("/:id", authMiddleware, errorHandler(async (ctx) => {
        const book = await this.getBookById.execute(ctx.params.id!);
        ctx.response.body = book;
      }))
      .post("/", authMiddleware, validateBody(createBookSchema), errorHandler(async (ctx) => {
        const { title, author, description } = await ctx.request.body.json();
        const book = await this.createBook.execute(title, author, description);
        ctx.response.status = 201;
        ctx.response.body = book;
      }))
      .patch("/:id", authMiddleware, validateBody(updateBookSchema), errorHandler(async (ctx) => {
        const data = await ctx.request.body.json();
        const book = await this.updateBook.execute(ctx.params.id!, data);
        ctx.response.body = book;
      }))
      .delete("/:id", authMiddleware, errorHandler(async (ctx) => {
        await this.deleteBook.execute(ctx.params.id!);
        ctx.response.status = 204;
      }));
  }
}
