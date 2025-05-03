import { Request, Response, NextFunction } from "express";
import {
  findRefreshToken,
  removeAllRefreshTokensForUser,
  removeRefreshToken,
} from "../services/auth/refresh";
import { safeVerifyToken, TokenType } from "../utils/jwt";

/**
 * Handles user logout by invalidating refresh tokens
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get refresh token from cookies
    const { jwt: refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.sendStatus(204); // No content - nothing to logout
    }

    // Check if token exists in database
    const storedRefreshToken = await findRefreshToken(refreshToken);

    // If the token isn't in the database, it's already invalid. Clear the cookie and return.
    if (!storedRefreshToken) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh-token", // Match the path used when setting the cookie
      });
      return res.status(204).send(); // No content
    }

    // Verify token validity
    const decoded = await safeVerifyToken(refreshToken, TokenType.REFRESH);

    // Delete token from database regardless of validity
    await removeRefreshToken(refreshToken);

    // If we have a valid token with user_id, remove all refresh tokens for that user
    if (decoded?.user_id) {
      await removeAllRefreshTokensForUser(decoded.user_id);
    }

    // Clear the cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh-token", // Match the path used when setting the cookie
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(
      "Logout Error: ",
      error instanceof Error ? error.message : String(error)
    );
    next(error);
  }
}
