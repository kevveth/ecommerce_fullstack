import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { addRefreshToken } from "../services/auth/refresh";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenType,
} from "../utils/jwt";
import { loginSchema } from "@repo/shared/schemas";
import { getWithEmail } from "../services/users";
import { z } from "zod";
import UnauthorizedError from "../errors/UnauthorizedError";

/**
 * Handles user login requests
 * Uses Zod v4's schema validation with improved error handling
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use the shared loginSchema with Zod v4's validation
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      // Use Zod v4's prettifyError for better formatted errors
      const formattedErrors = z.prettifyError(result.error);
      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { email, password } = result.data;

    const user = await getWithEmail(email);
    if (!user) {
      return next(
        new UnauthorizedError({
          message: "Invalid email or password",
          logging: false, // Not logging to avoid security leaks
        })
      );
    }

    // Check if the user has a password_hash (if not, they're using OAuth)
    if (!user.password_hash) {
      return next(
        new UnauthorizedError({
          message:
            "This account uses social login. Please sign in with Google.",
          logging: false,
        })
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return next(
        new UnauthorizedError({
          message: "Invalid email or password",
          logging: false, // Not logging to avoid security leaks
        })
      );
    }

    // Create the token payload with user information
    const payload = {
      user_id: user.user_id!,
      role: user.role,
    };

    try {
      // Generate tokens
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      // Save refresh token with user
      await addRefreshToken(user.user_id!, refreshToken);

      // Set the refresh token as HTTP only cookie with improved security options
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/api/auth/refresh-token", // Restrict cookie to refresh token endpoint
      });

      // Return success response
      res.json({
        accessToken,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Token generation error:", error);
      next(
        new UnauthorizedError({
          message: "Authentication failed",
          logging: true,
        })
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    next(
      new UnauthorizedError({
        message: "Authentication failed",
        logging: true,
      })
    );
  }
};
