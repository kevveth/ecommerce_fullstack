import { Request, Response, NextFunction } from "express-serve-static-core";
import { verifyToken } from "../utils/jwt";
import { getWithId } from "../services/users";
import UnauthorizedError from "../errors/UnauthorizedError";
import type { UserPayload } from "../utils/jwt";
import { decode } from "punycode";
import { string } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Authentication Middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authorization.split(" ")[1];

  verifyToken(token!, (err: Error | null, decoded: UserPayload) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = decoded;
    next();
  });
};

export const authorize = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    return next();
  } else {
    const err = new UnauthorizedError({
      message: "You are not authenticated!",
      logging: true,
    });
    return next(err);
  }
}
