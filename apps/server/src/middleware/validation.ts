import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import BadRequestError from "../errors/BadRequestError.js";

/**
 * Centralized validation middleware factory
 * Creates middleware that validates request data against a Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: z.prettifyError(result.error) },
        })
      );
    }

    // Attach validated data to request for type safety
    req.validatedBody = result.data;
    next();
  };
}

/**
 * Validates request parameters against a schema
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(
        new BadRequestError({
          message: "Invalid parameters",
          context: { errors: z.prettifyError(result.error) },
        })
      );
    }

    req.validatedParams = result.data;
    next();
  };
}

/**
 * Validates query parameters against a schema
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(
        new BadRequestError({
          message: "Invalid query parameters",
          context: { errors: z.prettifyError(result.error) },
        })
      );
    }

    req.validatedQuery = result.data;
    next();
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedParams?: any;
      validatedQuery?: any;
    }
  }
}
