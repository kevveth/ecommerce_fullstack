import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { create, getWithEmail } from "../services/users";
import BadRequestError from "../errors/BadRequestError";

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body; // Destructure username, email, and password from the request body

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
  const passwordHash = await bcrypt.hash(password, salt);

  const result = await create({
    username,
    email,
    password: passwordHash,
  });

  const { query, user } = result;

  res.status(201).send({ data: user }); // Send the newly created user with 201 status code
}