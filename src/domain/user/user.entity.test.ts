import { assertEquals } from "@std/assert";
import { User, UserRole } from "./user.entity.ts";

Deno.test("User.create - creates user with USER role by default", () => {
  const user = User.create("test@example.com", "hashedpass");
  
  assertEquals(typeof user.id, "string");
  assertEquals(user.email, "test@example.com");
  assertEquals(user.password, "hashedpass");
  assertEquals(user.role, UserRole.USER);
});

Deno.test("User.create - creates user with ADMIN role", () => {
  const user = User.create("admin@example.com", "hashedpass", UserRole.ADMIN);
  
  assertEquals(user.role, UserRole.ADMIN);
});

Deno.test("User.updateRole - updates user role", () => {
  const user = new User("1", "test@example.com", "pass", UserRole.USER, "2024-01-01");
  const updated = user.updateRole(UserRole.ADMIN);
  
  assertEquals(updated.id, "1");
  assertEquals(updated.role, UserRole.ADMIN);
  assertEquals(updated.email, "test@example.com");
});

Deno.test("User.toResponse - excludes password", () => {
  const user = new User("1", "test@example.com", "secret", UserRole.USER, "2024-01-01");
  const response = user.toResponse();
  
  assertEquals(response.id, "1");
  assertEquals(response.email, "test@example.com");
  assertEquals(response.role, UserRole.USER);
  assertEquals(response.createdAt, "2024-01-01");
  assertEquals("password" in response, false);
});
