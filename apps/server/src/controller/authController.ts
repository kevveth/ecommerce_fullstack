import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { addRefreshToken } from "../services/auth/refresh";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { loginSchema, type LoginInput, type User } from "@repo/shared/schemas";
import { getWithEmail } from "../services/users";
import { z } from "zod";
import UnauthorizedError from "../errors/UnauthorizedError";

/**
 * Handles user login requests
 * Uses Zod 4's schema validation with improved error handling
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use the shared loginSchema with Zod 4's validation
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      // Use Zod 4's prettifyError for better formatted errors
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

    const payload = { user_id: user.user_id!, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token with user
    await addRefreshToken(user.user_id!, refreshToken);

    // Set the refresh token as HTTP only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

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
    console.error("Login error:", error);
    next(error);
  }
};
