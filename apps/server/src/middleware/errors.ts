import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { ZodError, z } from "zod/v4";

/**
 * Global error handling middleware
 * Uses Zod 4's prettifyError for formatting validation errors
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    // Handled Errors
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stack: err.stack,
          },
          null,
          2
        )
      );
    }

    res.status(statusCode).send({ errors });
  } else if (err instanceof ZodError) {
    // Use Zod 4's built-in prettifyError function instead of fromZodError
    const formattedErrors = z.prettifyError(err);
    console.log("Validation error:", JSON.stringify(formattedErrors, null, 2));
    res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  } else {
    // Unhandled Errors
    console.error(JSON.stringify(err, null, 2));
    res.status(500).send({ errors: [{ message: "Something went wrong!" }] });
  }
};
