export class Book {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly author: string,
    public readonly description?: string
  ) {}

  static create(title: string, author: string, description?: string): Book {
    return new Book(crypto.randomUUID(), title, author, description);
  }

  update(data: Partial<Pick<Book, "title" | "author" | "description">>): Book {
    return new Book(
      this.id,
      data.title ?? this.title,
      data.author ?? this.author,
      data.description ?? this.description
    );
  }
}
