import { NextFunction, Request, Response } from "express-serve-static-core";
import { get, update, remove } from "../services/users";
import {
  UpdateableUser,
  updateUserSchema,
  User,
  userSchema,
} from "../models/user.model";
import NotFoundError from "../errors/NotFoundError";
import z from "zod";

const reqParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/) // Matches positive integers only
    .transform((str) => parseInt(str)),
});

//Handles getting a user by ID
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { id } = reqParamSchema.parse(req.params); // Validate and get user ID from request parameters

  const result = await get(id); // Get the user from the database

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

//Handles updating an existing user
export async function updateUser(
  req: Request<
    {}, // Request parameters
    {}, // Query parameters
    UpdateableUser // Request body
  >,
  res: Response
) {
  const { id } = reqParamSchema.parse(req.params); // Get user ID from request parameters

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
  const { id } = reqParamSchema.parse(req.params); // Get user ID from request parameters

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
