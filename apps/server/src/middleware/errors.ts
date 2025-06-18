import { Request, Response, NextFunction } from "express";
// import { CustomError } from "../errors/CustomError.js";
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
  if (err instanceof ZodError) {
    // Use Zod 4's built-in prettifyError function
    const prettyErrors = z.prettifyError(err);
    console.error(prettyErrors);
    res.sendStatus(400);
  } else {
    // Unhandled Errors
    if (res.headersSent) {
      next(err);
    }
    console.error(JSON.stringify(err, null, 2));
    res.status(500).send({ errors: [{ message: "Something went wrong!" }] });
  }
};
