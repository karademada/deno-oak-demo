import { Context, Next } from "@oak/oak";
import Joi from "joi";

/**
 * Schema for creating a book.
 * - title and author are required
 * - other fields are optional but validated
 */
export const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  author: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(1000).optional(),
});

/**
 * Schema for updating a book.
 * All fields are optional but at least one must be present.
 */
export const updateBookSchema = createBookSchema
  .fork(["title", "author", "description"], (schema) => schema.optional())
  .or("title", "author", "description");

export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (ctx: Context, next: Next) => {
    try {
      const body = await ctx.request.body.json();
      await schema.validateAsync(body, { abortEarly: false });
      await next();
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.body = {
        errors:
          err instanceof Joi.ValidationError
            ? err.details.map(
                (detail: Joi.ValidationErrorItem) => detail.message
              )
            : ["Invalid request body"],
      };
    }
  };
};
