import { assertEquals } from "@std/assert";
import { createBookSchema, updateBookSchema } from "./validation.ts";
import Joi from "joi";

Deno.test("createBookSchema - valid book", async () => {
  const valid = { title: "Test Book", author: "Test Author" };
  const result = await createBookSchema.validateAsync(valid);
  assertEquals(result, valid);
});

Deno.test("createBookSchema - missing title", async () => {
  try {
    await createBookSchema.validateAsync({ author: "Test Author" });
  } catch (err: unknown) {
    const error = err as Joi.ValidationError;
    assertEquals(error.details[0].path[0], "title");
  }
});

Deno.test("createBookSchema - missing author", async () => {
  try {
    await createBookSchema.validateAsync({ title: "Test Book" });
  } catch (err: unknown) {
    const error = err as Joi.ValidationError;
    assertEquals(error.details[0].path[0], "author");
  }
});

Deno.test("updateBookSchema - valid partial update", async () => {
  const valid = { title: "Updated Title" };
  const result = await updateBookSchema.validateAsync(valid);
  assertEquals(result, valid);
});

Deno.test("updateBookSchema - requires at least one field", async () => {
  try {
    await updateBookSchema.validateAsync({});
  } catch (err: unknown) {
    const error = err as Joi.ValidationError;
    assertEquals(error.details.length > 0, true);
  }
});
