import { Context, Next } from "@oak/oak";
import { UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";

export const requireRole = (repository: UserRepository, ...roles: UserRole[]) => {
  return async (ctx: Context, next: Next) => {
    const userId = ctx.state.userId;
    
    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Unauthorized" };
      return;
    }

    const user = await repository.findById(userId);
    
    if (!user || !roles.includes(user.role)) {
      ctx.response.status = 403;
      ctx.response.body = { message: "Forbidden" };
      return;
    }

    await next();
  };
};
