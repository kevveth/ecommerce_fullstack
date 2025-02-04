import { config } from "dotenv"; // Import environment variables
config();

import { Request, Response, NextFunction } from "express-serve-static-core";
import { get, update, remove } from "../services/users";
import {
  UpdateableUser,
  updateUserSchema,
  User,
  userSchema,
} from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import z from "zod";

const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/) // Matches positive integers only
    .transform((str) => parseInt(str, 10)),
});

//Handles getting a user by ID
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { id } = userIdSchema.parse(req.params); // Validate and get user ID from request parameters

  const user: User = await get(id); // Get the user from the database

  // Check if user exists
  if (!user) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { method: "GET", path: "/users/:id", id },
    });
  }

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
  const { id } = userIdSchema.parse(req.params); // Get user ID from request parameters
  
  // Get update data from request body
  const updates = updateUserSchema.parse(req.body);
  const user: User = await update(id, updates); // Update the user in the database

  if (!user) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { path: "/users/:id", id, method: "PUT" },
    });
  }

  res.status(200).send({ data: user }); // Send updated user data with 200 status code
}

//Handles deleting a user
export async function deleteUser(
  req: Request<{ id: number }>,
  res: Response
): Promise<void> {
  const { id } = req.params; // Get user ID from request parameters

  if (!id) {
    // Check if ID is present
    throw new BadRequestError({
      message: "ID is required",
      logging: true,
    });
  }

  const user = await remove(id); // Delete the user from the database

  if (!user) {
    // Check if user exists
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { path: "/users/:id", id, method: "DELETE" },
    });
  }

  res.status(204).send({ data: user }); // Send empty response with 204 status code
}
