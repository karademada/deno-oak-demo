import { assertEquals, assertRejects } from "@std/assert";
import { CreateUserUseCase } from "./create-user.usecase.ts";
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

Deno.test("CreateUserUseCase - creates user with specified role", async () => {
  const repository = new MockUserRepository();
  const useCase = new CreateUserUseCase(repository);

  const user = await useCase.execute("test@example.com", "password123", UserRole.ADMIN);

  assertEquals(user.email, "test@example.com");
  assertEquals(user.role, UserRole.ADMIN);
});

Deno.test("CreateUserUseCase - throws ConflictError if user exists", async () => {
  const repository = new MockUserRepository();
  const useCase = new CreateUserUseCase(repository);

  await useCase.execute("test@example.com", "password123", UserRole.USER);

  await assertRejects(
    () => useCase.execute("test@example.com", "password123", UserRole.USER),
    ConflictError,
    "User already exists"
  );
});
