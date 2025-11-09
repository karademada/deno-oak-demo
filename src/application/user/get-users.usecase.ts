import { User } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
