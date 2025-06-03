import { z } from "zod/v4";
import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/BadRequestError.js";

/**
 * Middleware to validate data using a Zod schema
 * @param schema - The Zod schema to validate against
 */
export const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        throw new BadRequestError({
          message: "Validation failed",
          context: { errors: z.prettifyError(result.error) },
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
