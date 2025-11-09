import { User } from "./user.entity.ts";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
