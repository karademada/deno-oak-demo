import { Context } from "@oak/oak";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error.ts";
import { ConflictError } from "../../shared/errors/conflict.error.ts";
import { ForbiddenError } from "../../shared/errors/forbidden.error.ts";

export const errorHandler = (handler: (ctx: Context) => Promise<void>) => {
  return async (ctx: Context) => {
    try {
      await handler(ctx);
    } catch (error) {
      if (error instanceof NotFoundError) {
        ctx.response.status = 404;
        ctx.response.body = { message: error.message };
      } else if (error instanceof UnauthorizedError) {
        ctx.response.status = 401;
        ctx.response.body = { message: error.message };
      } else if (error instanceof ConflictError) {
        ctx.response.status = 400;
        ctx.response.body = { message: error.message };
      } else if (error instanceof ForbiddenError) {
        ctx.response.status = 403;
        ctx.response.body = { message: error.message };
      } else {
        console.error("Unexpected error:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Internal server error" };
      }
    }
  };
};
