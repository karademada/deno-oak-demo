import { assertEquals } from "@std/assert";
import { CreateBookUseCase } from "./create-book.usecase.ts";
import { Book } from "../../domain/book/book.entity.ts";
import { BookRepository } from "../../domain/book/book.repository.ts";

class MockBookRepository implements BookRepository {
  private books: Book[] = [];

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find(b => b.id === id) || null;
  }

  async save(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async delete(id: string): Promise<void> {
    this.books = this.books.filter(b => b.id !== id);
  }
}

Deno.test("CreateBookUseCase - creates and saves a book", async () => {
  const repository = new MockBookRepository();
  const useCase = new CreateBookUseCase(repository);

  const book = await useCase.execute("Test Book", "Test Author", "Description");

  assertEquals(book.title, "Test Book");
  assertEquals(book.author, "Test Author");
  assertEquals(book.description, "Description");
  
  const saved = await repository.findById(book.id);
  assertEquals(saved?.id, book.id);
});
