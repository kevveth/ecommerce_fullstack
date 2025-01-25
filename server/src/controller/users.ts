import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express-serve-static-core";
import * as Users from "../models/users";
import asyncErrorHandler from "../utils/AsyncErrorHandler";
import { User } from "../types/user";

interface UserDTO {
  data: User;
}

export async function getUser(
  req: Request<{ id: string }>,
  res: Response<UserDTO>,
  next: NextFunction
): Promise<void> {
  const id = parseInt(req.params.id);

  if (!id) {
    throw new Error("ID is required");
  }

  const user = await Users.get(id);
  res.status(200).send({ data: user });
}
