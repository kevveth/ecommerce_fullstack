import { config } from "dotenv";
config();

import {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import * as Users from "../models/users";
import { User } from "../types/user";
import BadRequestError from "../errors/BadRequestError";
import bcrypt from "bcrypt";


interface UserDTO {
  data: User;
}

export async function createUser(
  req: Request,
  res: Response<UserDTO>
): Promise<void> {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError({
      message: "Missing a required field!",
      logging: true,
    });
  }

  // Hash Password
  const rounds = parseInt(process.env.SALT_ROUNDS as string);
  const salt = await bcrypt.genSalt(rounds);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = await Users.create({
    username,
    email,
    password_hash,
  });

  res.status(201).send({ data: newUser })
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
  req: Request<{ id: string }, {}, Partial<Omit<User, "user_id" | "password_hash">>>,
  res: Response<UserDTO>
): Promise<void> {
  const id = parseInt(req.params.id);
  const updates = req.body;
  console.log(updates);

  if (!id) {
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const updatedUser: User = await Users.update(id, updates);
  res.status(200).send({ data: updatedUser });
}

export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response<{ data: Partial<User>}>
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const deletedUser = await Users.remove(parseInt(id));
  res.status(204).send({ data: deletedUser.rows[0] })
}