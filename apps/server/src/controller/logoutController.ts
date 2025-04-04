import { Request, Response } from "express";
import {
  findRefreshToken,
  removeAllRefreshTokensForUser,
  removeRefreshToken,
} from "../services/auth/refresh";
import { verifyToken } from "../utils/jwt";

// TODO: Fix Response type
export async function logoutUser(req: Request, res: any) {
  try {
    const { jwt: refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    const storedRefreshToken = await findRefreshToken(refreshToken);
    // If the token isn't in the database, it's already invalid.  Clear the cookie and return.
    if (!storedRefreshToken) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).send(); //No content
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      // Even if the token is in the database, if it's not valid, clear cookie and return
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).send(); // No Content
    }

    // Remove refresh token from db
    await removeRefreshToken(refreshToken);
    await removeAllRefreshTokensForUser(decoded.user_id);

    // Clear the cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error: ", error);
    throw error;
  }
}
