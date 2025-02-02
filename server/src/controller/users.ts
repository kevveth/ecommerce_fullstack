import { config } from "dotenv"; // Import environment variables
config();

import { Request, Response, NextFunction } from "express-serve-static-core";
import { get, update, remove } from "../services/users";
import { UpdateableUser, updateUserSchema, User, userSchema } from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";



//Handles getting a user by ID
export async function getUser(
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params; // Get user ID from request parameters

  if (!id) {
    // Check if ID is present
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const user = await get(id); // Get the user from the database

  if (!user) {
    // Check if user exists
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { path: "/users/:id", id, method: "GET" },
    });
  }

  res.status(200).send({ data: user }); // Send the user data with 200 status code
}

//Handles updating an existing user
export async function updateUser(
  req: Request<
    { id: number }, // Request parameters
    {}, // Query parameters
    UpdateableUser // Request body
  >,
  res: Response
) {
  const { id } = req.params; // Get user ID from request parameters
  const updates: UpdateableUser = req.body; // Get update data from request body

  if (!id) {
    // Check if ID is present
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const user = await update(id, updates); // Update the user in the database

  if (!user) {
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { path: "/users/:id", id, method: "PUT" },
    })
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
