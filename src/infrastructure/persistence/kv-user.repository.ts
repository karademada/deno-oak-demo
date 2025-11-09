import { User } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";

export class KvUserRepository implements UserRepository {
  constructor(private readonly kv: Deno.Kv) {}

  async findAll(): Promise<User[]> {
    const users: User[] = [];
    for await (const entry of this.kv.list<User>({ prefix: ["users_by_id"] })) {
      const data = entry.value;
      users.push(new User(data.id, data.email, data.password, data.role, data.createdAt));
    }
    return users;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.kv.get<User>(["users_by_id", id]);
    if (!result.value) return null;
    const data = result.value;
    return new User(data.id, data.email, data.password, data.role, data.createdAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.kv.get<User>(["users", email]);
    if (!result.value) return null;
    const data = result.value;
    return new User(data.id, data.email, data.password, data.role, data.createdAt);
  }

  async save(user: User): Promise<User> {
    await this.kv.set(["users", user.email], user);
    await this.kv.set(["users_by_id", user.id], user);
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.kv.delete(["users", user.email]);
      await this.kv.delete(["users_by_id", id]);
    }
  }
}
