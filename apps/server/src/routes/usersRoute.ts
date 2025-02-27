import express, { Router, Request, Response, NextFunction } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserByUsername,
  updateUser,
} from "../controller/usersController";
import { validateUpdateData } from "../validation/user.validation";
import { authenticate, isAuthenticated } from "../middleware/verifyJWT";
import { getWithId } from "../services/users";
import NotFoundError from "../errors/NotFoundError";
import { User } from "../models/user.model";

const router: Router = express.Router();

// Example: GET /api/users/profile - Requires authentication
router.get(
  "/profile",
  authenticate,
  isAuthenticated,
  async (req: Request, res: any, next: NextFunction) => {
    if (!req.user)
      return next(
        new NotFoundError({ message: "User not found", logging: true })
      );

    const privateUser = await getWithId(req.user.user_id as number);

    if (!privateUser)
      return next(
        new NotFoundError({
          message: "User not found",
          logging: true,
        })
      );

    const safeUser: Omit<User, "password"> = privateUser;

    res.json({ message: "User Profile Data", user: safeUser });
  }
);

// router.get("/:id", getUser);
router.get("/", getAllUsers);
router.get("/:username", getUserByUsername);
router.put("/:id", validateUpdateData, updateUser);
router.delete("/:id", deleteUser);

export default router;
