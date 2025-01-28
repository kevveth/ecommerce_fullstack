import { config } from "dotenv";
config();

import { Request, Response, NextFunction } from "express-serve-static-core";
import { create, get, update, remove, UserResult } from "../models/users";
import { User } from "../types/user";
import BadRequestError from "../errors/BadRequestError";
import bcrypt from "bcrypt";
import NotFoundError from "../errors/NotFoundError";


export async function createUser(req: Request, res: Response): Promise<void> {
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

  const result: UserResult = await create({
    username,
    email,
    password_hash,
  });

  const newUser = result.user;

  res.status(201).send({ data: newUser! /* TODO: Replace force unwrap */ });
}

export async function getUser(
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const result: UserResult = await get(id);
  const { user, query } = result;

  if (!user) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
    });
  }

  res.status(200).send({ data: user });
}

export async function updateUser(
  req: Request<
    { id: number },
    {},
    Partial<Omit<User, "user_id" | "password_hash">>
  >,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const updates = req.body;
  // console.log(updates);

  if (!id) {
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const result: UserResult = await update(id, updates);
  const { query, user } = result;

  if (!user){
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
    });
  }

  res.status(200).send({ data: user });
}

export async function deleteUser(
  req: Request<{ id: number }>,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError({
      message: "ID is required",
      logging: true,
    });
  }

  const result: UserResult = await remove(id);
  const { user, query } = result;

  if (!user) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
    });
  }

  res.status(204).send({ data: user });
}
