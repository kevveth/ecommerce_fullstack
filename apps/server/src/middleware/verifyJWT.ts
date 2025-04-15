import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { getWithId } from "../services/users";
import UnauthorizedError from "../errors/UnauthorizedError";
import type { UserPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Authentication Middleware

// TODO: Fix Response type
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError({
        message: "Unauthorized: Missing token",
        logging: true,
      })
    );
  }

  const token = authorization?.split(" ")[1];
  // console.log(token);

  let decoded = null;
  if (token) decoded = verifyToken(token);

  if (!decoded) {
    return next(
      new UnauthorizedError({
        message: "Unauthorized: Invalid token",
        logging: true,
      })
    );
  }

  try {
    req.user = {
      user_id: decoded!.user_id,
      role: decoded!.role,
    };
    next();
  } catch (error) {
    console.error("Authentication Middleware Error: ", error);
    throw error;
  }
};

// TODO: Fix Response type
export const authorize = (requiredRole: string) => {
  return async (req: Request, res: any, next: NextFunction) => {
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
    next();
  } else {
    const err = new UnauthorizedError({
      message: "You are not authenticated!",
      logging: true,
    });
    next(err);
  }
}
