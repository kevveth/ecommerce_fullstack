import express, {
  Router,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserByUsername,
  updateUser,
} from "../controller/usersController";
import { validateSchema } from "../validation/user.validation";
import { getWithId } from "../services/users";
import NotFoundError from "../errors/NotFoundError";
import { User } from "../models/user.model";
import { profileUpdateSchema } from "@ecommerce/shared/schemas";

const router: Router = express.Router();

// Public routes - no authentication required
router.get("/", getAllUsers as RequestHandler);
router.get("/:username", getUserByUsername as RequestHandler);
router.put(
  "/:id",
  validateSchema(profileUpdateSchema),
  updateUser as RequestHandler
);
router.delete("/:id", deleteUser as RequestHandler);

export default router;
