import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return book;
  }
}
