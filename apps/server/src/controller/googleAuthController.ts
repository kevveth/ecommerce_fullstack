import { Request, Response, NextFunction } from "express";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  UserPayload,
} from "../utils/jwt";
import { addRefreshToken } from "../services/auth/refresh";
import AsyncErrorHandler from "../utils/AsyncErrorHandler";
import { User } from "../models/user.model";

// Initiate Google OAuth flow
export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

// Handle Google OAuth callback
export const googleAuthCallback = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      async (err: Error, user: User) => {
        if (err || !user || !user.user_id) {
          const errorMessage = err?.message || "Authentication failed";
          return res.redirect(
            `${process.env.CLIENT_URL}/auth/error?error=${encodeURIComponent(errorMessage)}`
          );
        }

        try {
          // Create payload with the required fields for token generation
          const userPayload: UserPayload = {
            user_id: user.user_id,
            role: user.role,
          };

          // Generate tokens
          const accessToken = await generateAccessToken(userPayload);
          const refreshToken = await generateRefreshToken(userPayload);

          // Store refresh token in database
          await addRefreshToken(user.user_id, refreshToken);

          // Set HTTP-only cookie with refresh token - using the same cookie name as authController.ts (jwt)
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "lax", // Changed to "lax" for consistency with other auth endpoints
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // Updated to 7 days for consistency
            path: "/", // Added path for consistency
          });

          // Redirect to client with access token in URL
          return res.redirect(
            `${process.env.CLIENT_URL}/auth/success?token=${accessToken}`
          );
        } catch (error) {
          console.error("Error during auth callback:", error);
          return res.redirect(
            `${process.env.CLIENT_URL}/auth/error?error=Server%20error`
          );
        }
      }
    )(req, res, next);
  }
);
