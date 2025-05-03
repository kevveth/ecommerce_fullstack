import { Request, Response, NextFunction } from "express";
import { safeVerifyToken, type UserPayload, TokenType } from "../utils/jwt";
import UnauthorizedError from "../errors/UnauthorizedError";

// Use module augmentation to add user property to Express Request interface
declare global {
  namespace Express {
    // Extend the User interface to include our properties
    interface User extends UserPayload {}
  }
}

/**
 * Authentication middleware that verifies JWT tokens in request headers
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError({
        message: "Unauthorized: Missing or invalid token format",
        logging: true,
      })
    );
  }

  const tokenParts = authorization.split(" ");
  if (tokenParts.length !== 2 || !tokenParts[1]) {
    return next(
      new UnauthorizedError({
        message: "Unauthorized: Invalid token format",
        logging: true,
      })
    );
  }

  const token = tokenParts[1];

  try {
    // Use safeVerifyToken which returns null on failure rather than throwing
    const decoded = await safeVerifyToken(token, TokenType.ACCESS);

    if (!decoded) {
      return next(
        new UnauthorizedError({
          message: "Unauthorized: Invalid token",
          logging: true,
        })
      );
    }

    // Set the user information on the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error instanceof Error ? error.message : String(error)
    );

    // Generic error handling
    next(
      new UnauthorizedError({
        message: "Unauthorized: Authentication failed",
        logging: true,
      })
    );
  }
};

/**
 * Role-based authorization middleware
 *
 * @param requiredRole - The role required to access the route
 * @returns Middleware function that checks user's role
 */
export const authorize = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== requiredRole) {
      return next(
        new UnauthorizedError({
          message: "Forbidden: Insufficient permissions",
          logging: true,
        })
      );
    }
    next();
  };
};

/**
 * Simple middleware to check if the user is authenticated
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user) {
    next();
  } else {
    const err = new UnauthorizedError({
      message: "You are not authenticated",
      logging: true,
    });
    next(err);
  }
}
