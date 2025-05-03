import { Request, Response, NextFunction } from "express";
import { newUserSchema, updateUserSchema } from "../models/user.model";
import { z } from "zod";
import BadRequestError from "../errors/BadRequestError";

/**
 * Middleware to validate registration data using Zod schemas
 */
export const validateRegistrationData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = newUserSchema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      return next();
    } else {
      const formattedErrors = z.prettifyError(result.error);
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: formattedErrors },
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to validate user update data using Zod schemas
 */
export const validateUpdateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = updateUserSchema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      return next();
    } else {
      const formattedErrors = z.prettifyError(result.error);
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: formattedErrors },
        })
      );
    }
  } catch (error) {
    next(error);
  }
};
