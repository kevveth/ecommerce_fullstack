import { NextFunction, Request, Response} from "express-serve-static-core";
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
export async function getUser(req: Request, res: any, next: NextFunction) {
  const { id } = reqParamSchema.parse(req.params); // Validate and get user ID from request parameters

  const user = await get(id); // Get the user from the database
  const { success, data, error } = userSchema.safeParse(user);

  // Check if user exists
  if (!success) {
    // throw new NotFoundError({
    //   message: "User not found!",
    //   logging: true,
    //   context: { method: "GET", path: "/users/:id", id },
    // });
    return next(error);
  }

  return res.status(200).send({ data });
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

  // Get update data from request body
  const updates = updateUserSchema.parse(req.body);
  const user: User = await update(id, updates); // Update the user in the database
  const { success, data } = userSchema.safeParse(user);

  if (!success) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { path: "/users/:id", id, method: "PUT" },
    });
  }

  res.status(200).send({ data }); // Send updated user data with 200 status code
}

//Handles deleting a user
export async function deleteUser(req: Request, res: Response) {
  const { id } = reqParamSchema.parse(req.params); // Get user ID from request parameters

  const user = await remove(id); // Delete the user from the database
  const { success, data } = userSchema.safeParse(user);

  if (!success) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { method: "GET", path: "/users/:id", id },
    });
  }

  res.status(204).send({ data });
}
