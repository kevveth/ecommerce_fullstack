import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import z, { ZodError } from "zod";
import { fromZodError, isZodErrorLike } from "zod-validation-error";

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
  } else if (isZodErrorLike(err)) {
    console.log(err);
    console.log(fromZodError(err).toString());
    res.status(400).json({
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  } else {
    // Unhandled Errors
    console.error(JSON.stringify(err, null, 2));
    res.status(500).send({ errors: [{ message: "Something went wrong!" }] });
  }
};
