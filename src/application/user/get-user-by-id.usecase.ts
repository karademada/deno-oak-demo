import { User } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
