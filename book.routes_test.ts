import { assertEquals } from "@std/assert";
import { Application } from "@oak/oak";
import bookRouter from "./book.routes.ts";

const app = new Application();
app.use(bookRouter.routes());

Deno.test("GET /books/:id - book not found", async () => {
  const req = new Request("http://localhost/api/books/nonexistent");
  const res = await app.handle(req);
  assertEquals(res?.status, 404);
});

Deno.test("POST /books - create book", async () => {
  const req = new Request("http://localhost/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test", author: "Author" }),
  });
  const res = await app.handle(req);
  assertEquals(res?.status, 201);
});

Deno.test("POST /books - invalid body", async () => {
  const req = new Request("http://localhost/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test" }),
  });
  const res = await app.handle(req);
  assertEquals(res?.status, 400);
});
