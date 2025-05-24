import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { addRefreshToken } from "../services/auth/refresh";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { loginSchema } from "../../../../packages/shared/dist/cjs/schemas";
import { getWithEmail } from "../services/users";
import { z } from "zod/v4";
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
          message: "Invalid email or password.", // Generalize error
          logging: false,
        })
      );
    }

    // Now password_hash is guaranteed to be a string
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
    if (typeof user.user_id === "undefined" || user.user_id === null) {
      console.error(
        `[LoginCritical] user_id is missing for user ${user.username} before generating tokens.`
      );
      return next(
        new Error("Critical error: User ID is missing before token generation.")
      ); // Fail fast
    }

    try {
      // Generate tokens
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      // Save refresh token with user
      await addRefreshToken(user.user_id!, refreshToken);

      // Set the refresh token as HTTP only cookie with improved security options
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax", // Changed from "strict" to "lax" to allow cookies on page loads
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/", // Allow cookie to be sent with all requests
      });

      // Prepare user object for response, ensuring it aligns with shared userSchema
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...otherFieldsFromUser } = user;
      const userForResponse = {
        ...otherFieldsFromUser,
        password_hash: null, // Explicitly set password_hash to null
      };

      // Return success response
      res.json({
        accessToken,
        tokenType: "Bearer", // Explicitly add tokenType
        user: userForResponse, // Send the modified user object
      });
    } catch (error) {
      console.error(
        `[LoginError] Token generation or refresh token saving error for user ${user.username}:`,
        error
      ); // Enhanced log
      next(
        new UnauthorizedError({
          message: "Authentication failed during token processing", // More specific message
          logging: true,
        })
      );
    }
  } catch (error) {
    console.error("[LoginError] Outer login process error:", error); // Enhanced log
    next(
      new UnauthorizedError({
        message: "Authentication failed",
        logging: true,
      })
    );
  }
};
