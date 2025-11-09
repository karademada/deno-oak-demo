import { UserRepository } from "../../domain/user/user.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    
    await this.userRepository.delete(id);
  }
}
