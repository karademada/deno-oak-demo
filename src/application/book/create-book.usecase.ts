import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(title: string, author: string, description?: string): Promise<Book> {
    const book = Book.create(title, author, description);
    return await this.bookRepository.save(book);
  }
}
