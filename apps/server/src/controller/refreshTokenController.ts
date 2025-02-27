import { Request, Response } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import {
  addRefreshToken,
  findRefreshToken,
  removeRefreshToken,
} from "../services/auth/refresh";
import { getWithId } from "../services/users";

// TODO: Fix Response type
export async function refreshToken(req: Request, res: any) {
  try {
    // Get refresh token from cookies
    const { jwt: refreshToken } = req.cookies;
    if (!refreshToken) {
      return new UnauthorizedError({
        message: "Unauthorized: No refresh token provided",
      });
    }

    const storedRefreshToken = await findRefreshToken(refreshToken);
    if (!storedRefreshToken) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }

    const user = await getWithId(decoded.user_id);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }

    // Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Store the new refresh token and invalidate the old one
    await addRefreshToken(user.user_id!, newRefreshToken);
    await removeRefreshToken(refreshToken); // Invalidates old refresh token

    // Set the new refresh token as HTTP only cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
}
