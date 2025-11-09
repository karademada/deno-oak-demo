export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: string
  ) {}

  static create(email: string, hashedPassword: string, role: UserRole = UserRole.USER): User {
    return new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      role,
      new Date().toISOString()
    );
  }

  updateRole(role: UserRole): User {
    return new User(this.id, this.email, this.password, role, this.createdAt);
  }

  toResponse() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
