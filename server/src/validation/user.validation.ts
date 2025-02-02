import { Request, Response, NextFunction } from "express";
import { newUserSchema } from "../models/user.model";

export const validateRegistrationData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await newUserSchema.spa(req.body);
  if (validate.success) {
    next();
  } else {
    res.status(400).send(validate.error.errors);
  }
};
