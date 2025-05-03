import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { create } from "../services/auth/registration";
import { env } from "../utils/env";
import { newUserSchema } from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";
import { ZodError, z } from "zod";
import { registrationSchema } from "@repo/shared/schemas";

/**
 * Handles user registration
 * Uses Zod 4's schema validation with improved error handling
 */
export async function registerUser(req: Request, res: Response) {
  try {
    // Use Zod 4's safeParse without custom error map
    const validationResult = newUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      const formattedErrors = z.prettifyError(validationResult.error);
      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { username, email, password } = validationResult.data;

    // Hash Password with better salt configuration
    const rounds = env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(rounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // Call service layer
    const result = await create({
      username,
      email,
      password: passwordHash,
    });

    // Return a successful response with the user data (minus sensitive info)
    res.status(201).json({
      message: "User registered successfully",
      data: {
        userId: result.user_id,
        username: result.username,
        email: result.email,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      // Format errors using Zod 4's prettifyError
      const formattedErrors = z.prettifyError(err);
      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
