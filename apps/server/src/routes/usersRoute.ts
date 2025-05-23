import express, {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserByUsername, // Corrected from getUserProfile
  updateUser, // Corrected from updateUserProfile
  getCurrentUserProfile,
} from "../controller/usersController";
import { validateSchema } from "../validation/user.validation"; // Replaced validateUpdateData with validateSchema
import { authenticate, isAuthenticated } from "../middleware/verifyJWT";
import { getWithId } from "../services/users";
import NotFoundError from "../errors/NotFoundError";
import { User } from "../models/user.model";
import { profileUpdateSchema } from "../../../../packages/shared/dist/cjs/schemas"; // Importing profileUpdateSchema from shared schemas

const router: Router = express.Router();

// Example: GET /api/users/profile - Requires authentication
router.get(
  "/profile",
  authenticate,
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return next(
        new NotFoundError({ message: "User not found", logging: true })
      );

    // Now that we've extended the Express.User interface, TypeScript knows about user_id
    const privateUser = await getWithId(req.user.user_id);

    if (!privateUser)
      return next(
        new NotFoundError({
          message: "User not found",
          logging: true,
        })
      );

    // Create a safe user object without password
    const { password_hash, ...safeUser } = privateUser;

    res.json({ message: "User Profile Data", user: safeUser });
  }
);

// Add /me route to return the authenticated user's info
router.get(
  "/me",
  authenticate,
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new NotFoundError({ message: "User not found", logging: true })
        );
      }
      const privateUser = await getWithId(req.user.user_id);
      if (!privateUser) {
        return next(
          new NotFoundError({ message: "User not found", logging: true })
        );
      }
      // Remove sensitive info
      const { password_hash, ...safeUser } = privateUser;
      res.json({ user: safeUser });
    } catch (error) {
      next(error);
    }
  }
);

// Route to get the current authenticated user's profile
router.get("/me", authenticate, getCurrentUserProfile);

// Explicitly cast the handlers to RequestHandler type to resolve overload issues
router.get("/", getAllUsers as RequestHandler);
router.get("/:username", getUserByUsername as RequestHandler);
router.put(
  "/me", // Changed from "/:id" to "/me"
  authenticate, // Added authentication
  validateSchema(profileUpdateSchema),
  updateUser as RequestHandler
);
router.delete("/:id", deleteUser as RequestHandler);

export default router;
