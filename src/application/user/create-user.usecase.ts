import * as bcrypt from "bcrypt";
import { User, UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { ConflictError } from "../../shared/errors/conflict.error.ts";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string, role: UserRole): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError("User already exists");

    const hashedPassword = await bcrypt.hash(password);
    const user = User.create(email, hashedPassword, role);
    return await this.userRepository.save(user);
  }
}
