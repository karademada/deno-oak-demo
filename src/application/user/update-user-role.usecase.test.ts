import { assertEquals, assertRejects } from "@std/assert";
import { UpdateUserRoleUseCase } from "./update-user-role.usecase.ts";
import { User, UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

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
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

Deno.test("UpdateUserRoleUseCase - updates user role", async () => {
  const repository = new MockUserRepository();
  const useCase = new UpdateUserRoleUseCase(repository);
  
  const user = User.create("test@example.com", "pass", UserRole.USER);
  await repository.save(user);

  const updated = await useCase.execute(user.id, UserRole.ADMIN);

  assertEquals(updated.role, UserRole.ADMIN);
  assertEquals(updated.id, user.id);
});

Deno.test("UpdateUserRoleUseCase - throws NotFoundError if user not found", async () => {
  const repository = new MockUserRepository();
  const useCase = new UpdateUserRoleUseCase(repository);

  await assertRejects(
    () => useCase.execute("nonexistent", UserRole.ADMIN),
    NotFoundError,
    "User not found"
  );
});
