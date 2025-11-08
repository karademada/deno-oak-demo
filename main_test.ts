import { assertEquals } from "@std/assert";
import { Application } from "@oak/oak";
import bookRouter from "./book.routes.ts";

Deno.test("Application initializes with book router", () => {
  const app = new Application();
  app.use(bookRouter.routes());
  app.use(bookRouter.allowedMethods());
  assertEquals(app !== null, true);
});
