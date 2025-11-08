import { Router } from "@oak/oak";
import * as bcrypt from "bcrypt";
import { create } from "djwt";
import { JWT_SECRET } from "./config.ts";
import type { User, UserResponse } from "./user.types.ts";
import { validateBody } from "./validation.ts";
import { registerSchema, loginSchema } from "./auth.validation.ts";

const kv = await Deno.openKv();
const authRouter = new Router();
authRouter.prefix("/api/auth");

authRouter.post("/register", validateBody(registerSchema), async (ctx) => {
  try {
    const { email, password } = await ctx.request.body.json();
    
    const existing = await kv.get<User>(["users", email]);
    if (existing.value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "User already exists" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password);
    const id = crypto.randomUUID();
    const user: User = {
      id,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await kv.set(["users", email], user);
    await kv.set(["users_by_id", id], user);

    const response: UserResponse = { id, email, createdAt: user.createdAt };
    ctx.response.status = 201;
    ctx.response.body = response;
  } catch (error) {
    console.error("Error registering user:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
});

authRouter.post("/login", validateBody(loginSchema), async (ctx) => {
  try {
    const { email, password } = await ctx.request.body.json();
    
    const result = await kv.get<User>(["users", email]);
    const user = result.value;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Invalid credentials" };
      return;
    }

    const token = await create(
      { alg: "HS512", typ: "JWT" },
      { userId: user.id, email: user.email },
      JWT_SECRET
    );

    ctx.response.body = { token };
  } catch (error) {
    console.error("Error logging in:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
});

export default authRouter;
