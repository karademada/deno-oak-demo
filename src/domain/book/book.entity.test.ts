import { assertEquals } from "@std/assert";
import { Book } from "./book.entity.ts";

Deno.test("Book.create - creates a new book with generated ID", () => {
  const book = Book.create("Test Title", "Test Author", "Test Description");
  
  assertEquals(typeof book.id, "string");
  assertEquals(book.title, "Test Title");
  assertEquals(book.author, "Test Author");
  assertEquals(book.description, "Test Description");
});

Deno.test("Book.update - updates book properties", () => {
  const book = new Book("1", "Old Title", "Old Author", "Old Description");
  const updated = book.update({ title: "New Title" });
  
  assertEquals(updated.id, "1");
  assertEquals(updated.title, "New Title");
  assertEquals(updated.author, "Old Author");
  assertEquals(updated.description, "Old Description");
});
