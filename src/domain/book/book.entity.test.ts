import { assertEquals } from "@std/assert";
import { Book } from "./book.entity.ts";

Deno.test("Book.create - creates a new book with generated ID", () => {
  const book = Book.create("Test Title", "Test Author", "Test Description");
  
  assertEquals(typeof book.id, "string");
  assertEquals(book.title, "Test Title");
  assertEquals(book.author, "Test Author");
  assertEquals(book.description, "Test Description");
});

Deno.test("Book.create - creates book without description", () => {
  const book = Book.create("Test Title", "Test Author");
  
  assertEquals(typeof book.id, "string");
  assertEquals(book.title, "Test Title");
  assertEquals(book.author, "Test Author");
  assertEquals(book.description, undefined);
});

Deno.test("Book.update - updates title only", () => {
  const book = new Book("1", "Old Title", "Old Author", "Old Description");
  const updated = book.update({ title: "New Title" });
  
  assertEquals(updated.id, "1");
  assertEquals(updated.title, "New Title");
  assertEquals(updated.author, "Old Author");
  assertEquals(updated.description, "Old Description");
});

Deno.test("Book.update - updates author only", () => {
  const book = new Book("1", "Title", "Old Author", "Description");
  const updated = book.update({ author: "New Author" });
  
  assertEquals(updated.author, "New Author");
  assertEquals(updated.title, "Title");
});

Deno.test("Book.update - updates multiple fields", () => {
  const book = new Book("1", "Old Title", "Old Author", "Old Description");
  const updated = book.update({ title: "New Title", description: "New Description" });
  
  assertEquals(updated.title, "New Title");
  assertEquals(updated.description, "New Description");
  assertEquals(updated.author, "Old Author");
});

Deno.test("Book.update - preserves ID", () => {
  const book = new Book("original-id", "Title", "Author");
  const updated = book.update({ title: "Updated" });
  
  assertEquals(updated.id, "original-id");
});
