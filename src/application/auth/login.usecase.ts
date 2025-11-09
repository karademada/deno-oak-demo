import * as bcrypt from "bcrypt";
import { create } from "djwt";
import { UserRepository } from "../../domain/user/user.repository.ts";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error.ts";
import { JWT_SECRET } from "../../shared/config.ts";

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return await create(
      { alg: "HS512", typ: "JWT" },
      { userId: user.id, email: user.email },
      JWT_SECRET
    );
  }
}
