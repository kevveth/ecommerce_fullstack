import { Request, Response, NextFunction, RequestHandler } from "express";
import * as Users from "../models/users";
import asyncErrorHandler from "../utils/AsyncErrorHandler";

export const getHandler = asyncErrorHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return new Error("ID is required");
  }

  const user = await Users.get(parseInt(id as string));
  return res.status(200).send({ data: user });
});
