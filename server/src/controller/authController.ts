import { Request, Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import { addRefreshToken } from "../services/auth/refresh";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { z } from "zod";
import type { User } from "../models/user.model";
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

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await getWithEmail(email);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user  );

    // Save refresh token with user
    await addRefreshToken(user.user_id!, refreshToken);

    // Set the refresh token as HTTP only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
