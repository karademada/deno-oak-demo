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
import { CreateUserUseCase } from "./application/user/create-user.usecase.ts";
import { GetUsersUseCase } from "./application/user/get-users.usecase.ts";
import { GetUserByIdUseCase } from "./application/user/get-user-by-id.usecase.ts";
import { UpdateUserRoleUseCase } from "./application/user/update-user-role.usecase.ts";
import { DeleteUserUseCase } from "./application/user/delete-user.usecase.ts";
import { BookController } from "./infrastructure/http/book.controller.ts";
import { AuthController } from "./infrastructure/http/auth.controller.ts";
import { UserController } from "./infrastructure/http/user.controller.ts";
import { seedAdminUser } from "./infrastructure/persistence/seed.ts";
import { swaggerSpec } from "../swagger.ts";

const kv = await Deno.openKv();

const bookRepository = new KvBookRepository(kv);
const userRepository = new KvUserRepository(kv);

await seedAdminUser(userRepository);

const createBook = new CreateBookUseCase(bookRepository);
const getBooks = new GetBooksUseCase(bookRepository);
const getBookById = new GetBookByIdUseCase(bookRepository);
const updateBook = new UpdateBookUseCase(bookRepository);
const deleteBook = new DeleteBookUseCase(bookRepository);
const register = new RegisterUseCase(userRepository);
const login = new LoginUseCase(userRepository);
const createUser = new CreateUserUseCase(userRepository);
const getUsers = new GetUsersUseCase(userRepository);
const getUserById = new GetUserByIdUseCase(userRepository);
const updateUserRole = new UpdateUserRoleUseCase(userRepository);
const deleteUser = new DeleteUserUseCase(userRepository);

const bookController = new BookController(createBook, getBooks, getBookById, updateBook, deleteBook);
const authController = new AuthController(register, login);
const userController = new UserController(createUser, getUsers, getUserById, updateUserRole, deleteUser, userRepository);

const app = new Application();
const router = new Router();
router.prefix("/api");

router.use(authController.router.routes());
router.use(authController.router.allowedMethods());
router.use(userController.router.routes());
router.use(userController.router.allowedMethods());
router.use(bookController.router.routes());
router.use(bookController.router.allowedMethods());

const docsRouter = new Router();

docsRouter.get("/api-docs", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
<html>
<head>
  <title>API Documentation Clean</title>
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

docsRouter.get("/api-docs.json", (ctx) => {
  ctx.response.body = swaggerSpec;
  ctx.response.type = "application/json";
});

app.use(docsRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is running on http://localhost:8000");
console.log("API Documentation: http://localhost:8000/api-docs");

app.listen({ port: 8000 });
