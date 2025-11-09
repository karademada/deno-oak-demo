import { Application, Router } from "@oak/oak";
import { KvBookRepository } from "./infrastructure/persistence/kv-book.repository.ts";
import { KvUserRepository } from "./infrastructure/persistence/kv-user.repository.ts";
import { CreateBookUseCase } from "./application/book/create-book.usecase.ts";
import { GetBooksUseCase } from "./application/book/get-books.usecase.ts";
import { GetBookByIdUseCase } from "./application/book/get-book-by-id.usecase.ts";
import { UpdateBookUseCase } from "./application/book/update-book.usecase.ts";
import { DeleteBookUseCase } from "./application/book/delete-book.usecase.ts";
import { RegisterUseCase } from "./application/auth/register.usecase.ts";
import { LoginUseCase } from "./application/auth/login.usecase.ts";
import { BookController } from "./infrastructure/http/book.controller.ts";
import { AuthController } from "./infrastructure/http/auth.controller.ts";
import { swaggerSpec } from "../swagger.ts";

const kv = await Deno.openKv();

const bookRepository = new KvBookRepository(kv);
const userRepository = new KvUserRepository(kv);

const createBook = new CreateBookUseCase(bookRepository);
const getBooks = new GetBooksUseCase(bookRepository);
const getBookById = new GetBookByIdUseCase(bookRepository);
const updateBook = new UpdateBookUseCase(bookRepository);
const deleteBook = new DeleteBookUseCase(bookRepository);
const register = new RegisterUseCase(userRepository);
const login = new LoginUseCase(userRepository);

const bookController = new BookController(createBook, getBooks, getBookById, updateBook, deleteBook);
const authController = new AuthController(register, login);

const app = new Application();
const router = new Router();

router.get("/api-docs", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${JSON.stringify(swaggerSpec)},
      dom_id: '#swagger-ui',
    });
  </script>
</body>
</html>`;
  ctx.response.type = "text/html";
});

router.get("/api-docs.json", (ctx) => {
  ctx.response.body = swaggerSpec;
  ctx.response.type = "application/json";
});

app.use(router.routes());
app.use(authController.router.routes());
app.use(authController.router.allowedMethods());
app.use(bookController.router.routes());
app.use(bookController.router.allowedMethods());

console.log("Server is running on http://localhost:8000");
console.log("API Documentation: http://localhost:8000/api-docs");

app.listen({ port: 8000 });
