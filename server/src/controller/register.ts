import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { create } from "../services/auth/registration";
import { env } from "../utils/env";

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body; // Destructure username, email, and password from the request body

  // Hash Password using bcrypt
  const rounds = parseInt(env.SALT_ROUNDS);
  const salt = await bcrypt.genSalt(rounds);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await create({
    username,
    email,
    password: passwordHash,
  });

  res.status(201).send({ data: newUser }); // Send the newly created user with 201 status code
}