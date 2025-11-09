import { Router, RouterContext } from "@oak/oak";
import { CreateUserUseCase } from "../../application/user/create-user.usecase.ts";
import { GetUsersUseCase } from "../../application/user/get-users.usecase.ts";
import { GetUserByIdUseCase } from "../../application/user/get-user-by-id.usecase.ts";
import { UpdateUserRoleUseCase } from "../../application/user/update-user-role.usecase.ts";
import { DeleteUserUseCase } from "../../application/user/delete-user.usecase.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { UserRole } from "../../domain/user/user.entity.ts";
import { authMiddleware } from "./auth.middleware.ts";
import { requireRole } from "./role.middleware.ts";
import { errorHandler } from "./error-handler.middleware.ts";

export class UserController {
  public router: Router;

  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUsers: GetUsersUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly updateUserRole: UpdateUserRoleUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly userRepository: UserRepository
  ) {
    this.router = new Router();
    this.router.prefix("/users");
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router
      .post("/", authMiddleware, requireRole(this.userRepository, UserRole.ADMIN), errorHandler(async (ctx) => {
        const { email, password, role } = await ctx.request.body.json();
        const user = await this.createUser.execute(email, password, role);
        ctx.response.status = 201;
        ctx.response.body = user.toResponse();
      }))
      .get("/", authMiddleware, requireRole(this.userRepository, UserRole.ADMIN), errorHandler(async (ctx) => {
        const users = await this.getUsers.execute();
        ctx.response.body = users.map(u => u.toResponse());
      }))
      .get("/:id", authMiddleware, requireRole(this.userRepository, UserRole.ADMIN), errorHandler(async (ctx) => {
        const user = await this.getUserById.execute((ctx as RouterContext<"/users/:id">).params.id);
        ctx.response.body = user.toResponse();
      }))
      .patch("/:id/role", authMiddleware, requireRole(this.userRepository, UserRole.ADMIN), errorHandler(async (ctx) => {
        const { role } = await ctx.request.body.json();
        const user = await this.updateUserRole.execute((ctx as RouterContext<"/users/:id/role">).params.id, role);
        ctx.response.body = user.toResponse();
      }))
      .delete("/:id", authMiddleware, requireRole(this.userRepository, UserRole.ADMIN), errorHandler(async (ctx) => {
        await this.deleteUser.execute((ctx as RouterContext<"/users/:id">).params.id);
        ctx.response.status = 204;
      }));
  }
}
