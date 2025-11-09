import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";
import { NotFoundError } from "../../shared/errors/not-found.error.ts";

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string, data: Partial<Pick<Book, "title" | "author" | "description">>): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    
    const updated = book.update(data);
    return await this.bookRepository.save(updated);
  }
}
