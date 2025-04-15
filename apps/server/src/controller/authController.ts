import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { addRefreshToken } from "../services/auth/refresh";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { z } from "zod";
import type { User } from "@repo/shared/schemas";
import { getWithEmail } from "../services/users";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginRequestBody = z.infer<typeof loginSchema>;

// TODO: Fix Response type
export const loginUser = async (req: Request, res: any) => {
  try {
    const validLogin: LoginRequestBody = loginSchema.parse(req.body);
    const { email, password } = validLogin;

    const user = await getWithEmail(email);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = { user_id: user.user_id!, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token with user
    await addRefreshToken(user.user_id!, refreshToken);

    // Set the refresh token as HTTP only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
