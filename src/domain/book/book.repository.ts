import { Book } from "./book.entity.ts";

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
  delete(id: string): Promise<void>;
}
