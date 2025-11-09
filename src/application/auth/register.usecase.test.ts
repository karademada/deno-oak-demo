import { assertEquals, assertRejects } from "@std/assert";
import { RegisterUseCase } from "./register.usecase.ts";
import { User, UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { ConflictError } from "../../shared/errors/conflict.error.ts";

class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

Deno.test("RegisterUseCase - registers user with default USER role", async () => {
  const repository = new MockUserRepository();
  const useCase = new RegisterUseCase(repository);

  const user = await useCase.execute("test@example.com", "password123");

  assertEquals(user.email, "test@example.com");
  assertEquals(user.role, UserRole.USER);
});

Deno.test("RegisterUseCase - registers user with ADMIN role", async () => {
  const repository = new MockUserRepository();
  const useCase = new RegisterUseCase(repository);

  const user = await useCase.execute("admin@example.com", "password123", UserRole.ADMIN);

  assertEquals(user.role, UserRole.ADMIN);
});

Deno.test("RegisterUseCase - throws ConflictError if user exists", async () => {
  const repository = new MockUserRepository();
  const useCase = new RegisterUseCase(repository);

  await useCase.execute("test@example.com", "password123");

  await assertRejects(
    () => useCase.execute("test@example.com", "password123"),
    ConflictError,
    "User already exists"
  );
});
