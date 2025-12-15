import { z } from 'zod';
import asyncHandler from '../utils/asyncHandler.ts';
import ApiError from '../utils/ApiError.ts';

export const validate = (schema: z.ZodTypeAny) =>
  asyncHandler(async (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const field = issue.path.length ? issue.path.join('.') : 'body';

        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }

        fieldErrors[field].push(issue.message);
      }

      const errors = Object.entries(fieldErrors).map(
        ([field, messages]) => ({
          field,
          errors: messages,
        })
      );

      throw new ApiError({
        statusCode: 400,
        message: 'Invalid data',
        errors,
      });
    }

    req.body.validatedData = result.data;
    next();
  });
