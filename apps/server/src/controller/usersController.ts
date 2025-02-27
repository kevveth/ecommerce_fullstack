import { NextFunction, Request, Response } from "express";
import {
  getWithId,
  update,
  remove,
  getWithUsername,
  getAll,
} from "../services/users";
import {
  UpdateableUser,
  updateUserSchema,
  User,
  userSchema,
} from "../models/user.model";
import NotFoundError from "../errors/NotFoundError";
import z from "zod";

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/) // Matches positive integers only
    .transform((str) => parseInt(str)),
});

const usernameParamSchema = z.object({
  username: z.string(),
});

export async function getAllUsers(req: Request, res: Response) {
  const result = await getAll();

  if (!result) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: {
        method: "GET",
        expected: "users",
        received: "undefined",
        path: ["users"],
      },
    });
  }

  const users = result.map((user) => userSchema.parse(user));
  res.status(200).send({ data: users });
}

//Handles getting a user by ID
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { id } = idParamSchema.parse(req.params); // Validate and get user ID from request parameters

  const result = await getWithId(id); // Get the user from the database

  if (!result) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: {
        method: "GET",
        expected: "user",
        received: "undefined",
        path: ["users", "id"],
        id,
      },
    });
  }

  const user = userSchema.parse(result);
  res.status(200).send({ data: user });
}

export async function getUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = usernameParamSchema.parse(req.params); // Validate and get user ID from request parameters

  const result = await getWithUsername(username); // Get the user from the database

  if (!result) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: {
        method: "GET",
        expected: "user",
        received: "undefined",
        path: ["users", "username"],
        username,
      },
    });
  }

  const user = userSchema.parse(result);
  res.status(200).send({ data: user });
}

//Handles updating an existing user
export async function updateUser(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params); // Get user ID from request parameters

  const result = await update(id, req.body); // Update the user in the database

  if (!result) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: {
        method: "PUT",
        expected: "user",
        received: "undefined",
        path: ["users", "id"],
        id,
      },
    });
  }

  const user = userSchema.parse(result);
  res.status(200).send({ data: user }); // Send updated user data with 200 status code
}

//Handles deleting a user
export async function deleteUser(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params); // Get user ID from request parameters

  const result = await remove(id); // Delete the user from the database

  if (!result) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: {
        method: "DELETE",
        expected: "user",
        received: "undefined",
        path: ["users", "id"],
        id,
      },
    });
  }

  const user = userSchema.parse(result);
  res.status(204).send({ data: user });
}
