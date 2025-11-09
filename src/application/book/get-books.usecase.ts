import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";

export class GetBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }
}
