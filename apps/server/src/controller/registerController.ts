import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { create } from "../services/auth/registration";
import { env } from "../utils/env";
import { newUserSchema } from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";
import { ZodError } from "zod";

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  try {
    // Validate Input
    const validatedData = await newUserSchema.parseAsync(req.body);
    console.log("Validated data: ");
    console.log(validatedData);
    const { username, email, password } = validatedData; // Destructure username, email, and password from the request body

    // Hash Password
    const rounds = env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(rounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // Call service layer
    const result = await create({
      username,
      email,
      password: passwordHash,
    });

    // const user = userSchema.parse(result);
    res.status(201).send({ data: result }); // Send the newly created user with 201 status code
  } catch (err) {
    throw err;
  }
}
