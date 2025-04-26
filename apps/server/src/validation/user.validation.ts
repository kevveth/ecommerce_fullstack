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
    // Use safeParseAsync for async validation (email uniqueness check)
    const result = await newUserSchema.safeParseAsync(req.body);

    if (result.success) {
      // Store the validated data in the request for use in controller
      req.body = result.data;
      return next();
    } else {
      // Use the central error handling middleware with BadRequestError
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: result.error.format() },
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
      // Store the validated and transformed data in the request
      req.body = result.data;
      return next();
    } else {
      // Use the central error handling middleware with BadRequestError
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: result.error.format() },
        })
      );
    }
  } catch (error) {
    next(error);
  }
};
