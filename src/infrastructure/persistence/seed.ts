import * as bcrypt from "bcrypt";
import { User, UserRole } from "../../domain/user/user.entity.ts";
import { UserRepository } from "../../domain/user/user.repository.ts";

export async function seedAdminUser(userRepository: UserRepository): Promise<void> {
  const adminEmail = "admin@example.com";
  
  const existing = await userRepository.findByEmail(adminEmail);
  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123");
  const admin = User.create(adminEmail, hashedPassword, UserRole.ADMIN);
  await userRepository.save(admin);
  
  console.log("Admin user created:");
  console.log("  Email: admin@example.com");
  console.log("  Password: admin123");
  console.log("  Role: ADMIN");
}
