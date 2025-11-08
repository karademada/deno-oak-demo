import { Context, Next } from "@oak/oak";
import { verify } from "djwt";
import { JWT_SECRET } from "./config.ts";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.slice(7);
  
  try {
    const payload = await verify(token, JWT_SECRET);
    ctx.state.userId = payload.userId;
    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid token" };
  }
};
