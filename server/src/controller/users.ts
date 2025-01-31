import { config } from "dotenv"; // Import environment variables
config();

import { Request, Response, NextFunction } from "express-serve-static-core";
import { create, get, update, remove, UserResult } from "../models/users";
import { User } from "../types/user";
import BadRequestError from "../errors/BadRequestError";
import bcrypt from "bcrypt";
import NotFoundError from "../errors/NotFoundError";

//Handles creating a new user.
export async function createUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body; // Destructure username, email, and password from the request body

  if (!username || !email || !password) {
    //Check for missing fields
    throw new BadRequestError({
      message: "Missing a required field!",
      logging: true,
    });
  }

  // Hash Password using bcrypt
  const rounds = parseInt(process.env.SALT_ROUNDS as string);
  const salt = await bcrypt.genSalt(rounds);
  const password_hash = await bcrypt.hash(password, salt);

  const result: UserResult = await create({
    username,
    email,
    password_hash,
  });

  const newUser = result.user;

  // TODO: Replace force unwrap
  res.status(201).send({ data: newUser! }); // Send the newly created user with 201 status code
}

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

  const result: UserResult = await get(id); // Get the user from the database
  const { user, query } = result;

  if (!user) {
    // Check if user exists
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
    });
  }

  res.status(200).send({ data: user }); // Send the user data with 200 status code
}

//Handles updating an existing user
export async function updateUser(
  req: Request<
    { id: number }, // Request parameters
    {}, // Query parameters
    Partial<Omit<User, "user_id" | "password_hash">> // Request body
  >,
  res: Response
): Promise<void> {
  const { id } = req.params; // Get user ID from request parameters
  const updates = req.body; // Get update data from request body

  if (!id) {
    // Check if ID is present
    throw new BadRequestError({
      code: 400,
      message: "ID is required",
      logging: true,
    });
  }

  const result: UserResult = await update(id, updates); // Update the user in the database
  const { query, user } = result;

  if (!user) {
    // Check if user exists
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
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

  const result: UserResult = await remove(id); // Delete the user from the database
  const { user, query } = result;

  if (!user) {
    // Check if user exists
    throw new NotFoundError({
      message: "User not found!",
      logging: true,
      context: { query, id },
    });
  }

  res.status(204).send({ data: user }); // Send empty response with 204 status code
}
