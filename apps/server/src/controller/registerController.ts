import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { create } from "../services/auth/registration";
import { env } from "../utils/env";
import { newUserSchema } from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";
import { ZodError, z } from "zod";
import { registrationSchema } from "@repo/shared/schemas";

// Custom error map for registration-specific validation messages
const registrationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  // Custom error messages that provide more specific feedback
  if (issue.code === "custom" && issue.path.includes("email")) {
    return { message: "This email is already registered" };
  }

  // Default to the error messages defined in the schema
  return { message: ctx.defaultError };
};

//Handles creating a new user.
export async function registerUser(req: Request, res: Response) {
  try {
    // Use safeParse for more controlled error handling
    const validationResult = await newUserSchema.safeParseAsync(req.body, {
      errorMap: registrationErrorMap,
    });

    if (!validationResult.success) {
      // Format the validation errors for a better client response
      const errors = validationResult.error.format();
      return res.status(400).json({
        message: "Validation failed",
        errors,
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
      // Fallback for any ZodErrors not caught by safeParse
      return res.status(400).json({
        message: "Validation failed",
        errors: err.format(),
      });
    }

    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
