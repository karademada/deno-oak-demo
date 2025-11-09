import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";

export class KvBookRepository implements BookRepository {
  constructor(private readonly kv: Deno.Kv) {}

  async findAll(): Promise<Book[]> {
    const books: Book[] = [];
    for await (const entry of this.kv.list<Book>({ prefix: ["books"] })) {
      const data = entry.value;
      books.push(new Book(data.id, data.title, data.author, data.description));
    }
    return books;
  }

  async findById(id: string): Promise<Book | null> {
    const result = await this.kv.get<Book>(["books", id]);
    if (!result.value) return null;
    const data = result.value;
    return new Book(data.id, data.title, data.author, data.description);
  }

  async save(book: Book): Promise<Book> {
    await this.kv.set(["books", book.id], book);
    return book;
  }

  async delete(id: string): Promise<void> {
    await this.kv.delete(["books", id]);
  }
}
