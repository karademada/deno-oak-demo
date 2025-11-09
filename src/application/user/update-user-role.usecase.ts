import { User, UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, role: UserRole): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    
    const updated = user.updateRole(role);
    return await this.userRepository.save(updated);
  }
}
