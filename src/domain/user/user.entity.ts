export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: string
  ) {}

  static create(email: string, hashedPassword: string): User {
    return new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      new Date().toISOString()
    );
  }

  toResponse() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
