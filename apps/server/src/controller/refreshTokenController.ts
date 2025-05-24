import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import {
  generateAccessToken,
  generateRefreshToken,
  safeVerifyToken,
} from "../utils/jwt";
import { Token } from "@ecommerce/shared/schemas";
import {
  addRefreshToken,
  findRefreshToken,
  removeRefreshToken,
} from "../services/auth/refresh";
import { getWithId } from "../services/users";
import { z } from "zod/v4";

/**
 * Refreshes an access token using a valid refresh token
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get refresh token from cookies
    const { jwt: refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(
        new UnauthorizedError({
          message: "Unauthorized: No refresh token provided",
          logging: true,
        })
      );
    }

    // Verify the token exists in the database
    const storedRefreshToken = await findRefreshToken(refreshToken);
    if (!storedRefreshToken) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }

    // Verify the token is valid cryptographically
    const decoded = await safeVerifyToken(refreshToken, "REFRESH");
    if (!decoded) {
      await removeRefreshToken(refreshToken); // Remove invalid token from database
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired refresh token" });
    }

    // Verify the user still exists
    const user = await getWithId(decoded.user_id);
    if (!user) {
      await removeRefreshToken(refreshToken);
      return res
        .status(403)
        .json({ message: "Forbidden: User no longer exists" });
    }

    // Generate new access and refresh tokens with proper validation
    const payload = {
      user_id: user.user_id!,
      role: user.role,
    };

    try {
      // Generate new tokens
      const newAccessToken = await generateAccessToken(payload);
      const newRefreshToken = await generateRefreshToken(payload);

      // Update token storage
      await addRefreshToken(user.user_id!, newRefreshToken);
      await removeRefreshToken(refreshToken); // Invalidate old refresh token

      // Set the new refresh token as HTTP only cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from "strict" to "lax" to allow cookies on page loads
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/", // Use root path to ensure cookie is sent with all requests
      });

      // Return the new access token
      res.json({
        accessToken: newAccessToken,
        tokenType: "Bearer",
      });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        console.error(
          "Token payload validation error:",
          z.prettifyError(error)
        );
        return next(
          new UnauthorizedError({
            message: "Authentication error: Invalid token payload",
            logging: true,
          })
        );
      }

      // Handle other errors
      throw error;
    }
  } catch (error) {
    console.error(
      "Refresh token error:",
      error instanceof Error ? error.message : String(error)
    );
    next(error);
  }
}
