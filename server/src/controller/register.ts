import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { create } from "../services/auth/registration";
import { env } from "../utils/env";
import { userSchema } from "../models/user.model";

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body; // Destructure username, email, and password from the request body

  // Hash Password using bcrypt
  const rounds = env.SALT_ROUNDS;
  const salt = await bcrypt.genSalt(rounds);
  const passwordHash = await bcrypt.hash(password, salt);

  const result = await create({
    username,
    email,
    password: passwordHash,
  });

  const user = userSchema.parse(result);
  res.status(201).send({ data: user }); // Send the newly created user with 201 status code
}