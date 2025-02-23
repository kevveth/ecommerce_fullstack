import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "./env";
import type { Role } from "../models/user.model";

export interface UserPayload {
  user_id: number | string;
  role: Role;
}

export function generateAccessToken(user: UserPayload) {
  const accessToken = jwt.sign(
    { sub: user.user_id, role: user.role },
    env.JWT_SECRET!,
    {
      expiresIn: "10s",
    }
  );

  return accessToken;
}

export function generateRefreshToken(user: UserPayload) {
  const refreshToken = jwt.sign(
    { sub: user.user_id, role: user.role },
    env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return refreshToken;
}

// Verify and decode a JWT, and define the return type
export function verifyToken(
  token: string,
  handleVerification?: Function | null
): JwtPayload | null {
  try {
    if (handleVerification)
      return jwt.verify(token, env.JWT_SECRET!, handleVerification());
    return jwt.verify(token, env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    return null; // Invalid token
  }
}
