import { Router } from "@oak/oak";
import { RegisterUseCase } from "../../application/auth/register.usecase.ts";
import { LoginUseCase } from "../../application/auth/login.usecase.ts";
import { validateBody } from "./validation.middleware.ts";
import { registerSchema, loginSchema } from "./validation.schemas.ts";
import { errorHandler } from "./error-handler.middleware.ts";

export class AuthController {
  public router: Router;

  constructor(
    private readonly register: RegisterUseCase,
    private readonly login: LoginUseCase
  ) {
    this.router = new Router();
    this.router.prefix("/auth");
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router
      .post("/register", validateBody(registerSchema), errorHandler(async (ctx) => {
        const { email, password } = await ctx.request.body.json();
        const user = await this.register.execute(email, password);
        ctx.response.status = 201;
        ctx.response.body = user.toResponse();
      }))
      .post("/login", validateBody(loginSchema), errorHandler(async (ctx) => {
        const { email, password } = await ctx.request.body.json();
        const token = await this.login.execute(email, password);
        ctx.response.body = { token };
      }));
  }
}
