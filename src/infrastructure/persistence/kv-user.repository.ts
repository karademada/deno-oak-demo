import { User } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";

export class KvUserRepository implements UserRepository {
  constructor(private readonly kv: Deno.Kv) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.kv.get<User>(["users", email]);
    if (!result.value) return null;
    const data = result.value;
    return new User(data.id, data.email, data.password, data.createdAt);
  }

  async save(user: User): Promise<User> {
    await this.kv.set(["users", user.email], user);
    await this.kv.set(["users_by_id", user.id], user);
    return user;
  }
}
