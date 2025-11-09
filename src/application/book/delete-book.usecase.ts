import { BookRepository } from "../../domain/book/book.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    
    await this.bookRepository.delete(id);
  }
}
