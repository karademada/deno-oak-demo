import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  author: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(1000).optional(),
});

export const updateBookSchema = createBookSchema
  .fork(["title", "author", "description"], (schema) => schema.optional())
  .or("title", "author", "description");

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
