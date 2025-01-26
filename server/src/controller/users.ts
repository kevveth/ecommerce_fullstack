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

export async function updateUser(
  req: Request<{ id: string }, {}, Partial<Omit<User, "userId" | "password">>>,
  res: Response<UserDTO>
): Promise<void> {
  const id = parseInt(req.params.id)
  const updates = req.body
  console.log(updates);
  
  if (!id) {
    throw new Error("ID is required");
  }

  const updatedUser: User = await Users.update(id, updates);
  if (!updatedUser) {
    throw new Error(`User with ID: ${id} not found`)
  }

  res.status(200).send({ data: updatedUser });
}
