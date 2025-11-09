import { Context, Next } from "@oak/oak";
import Joi from "joi";

export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (ctx: Context, next: Next) => {
    try {
      const body = await ctx.request.body.json();
      await schema.validateAsync(body, { abortEarly: false });
      await next();
    } catch (err: unknown) {
      ctx.response.status = 400;
      ctx.response.body = {
        errors:
          err instanceof Joi.ValidationError
            ? err.details.map((detail: Joi.ValidationErrorItem) => detail.message)
            : ["Invalid request body"],
      };
    }
  };
};
