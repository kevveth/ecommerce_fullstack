import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "./env";
import type { Role, User } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

export interface UserPayload {
  user_id: number;
  role: Role;
}

export function generateAccessToken(payload: UserPayload) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "13s",
  });

  return accessToken;
}

export function generateRefreshToken(payload: UserPayload) {
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return refreshToken;
}

// Verify and decode a JWT, and define the return type
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload &
      UserPayload;
  } catch {
    return null; // Invalid token
  }
}
