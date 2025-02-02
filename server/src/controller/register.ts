import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { create, getWithEmail } from "../services/users";
import BadRequestError from "../errors/BadRequestError";

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body; // Destructure username, email, and password from the request body

  if (!username || !email || !password) {
    //Check for missing fields
    throw new BadRequestError({
      message: "Missing a required field!",
      logging: true,
    });
  }

  const userAlreadyExists = await getWithEmail(email);
  if(userAlreadyExists.user) {
    throw new BadRequestError({
      message: "User already exists!",
      logging: true,
    });
  }

  // Hash Password using bcrypt
  const rounds = parseInt(process.env.SALT_ROUNDS as string);
  const salt = await bcrypt.genSalt(rounds);
  const password_hash = await bcrypt.hash(password, salt);

  const result = await create({
    username,
    email,
    password_hash,
  });

  const { query, user } = result;

  res.status(201).send({ data: user }); // Send the newly created user with 201 status code
}