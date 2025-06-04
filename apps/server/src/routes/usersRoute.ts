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
  // updateUser,
} from "../controller/usersController.js";
import { validateSchema } from "../validation/user.validation.js";
import { getWithId } from "../services/users.js";
import NotFoundError from "../errors/NotFoundError.js";
import { User } from "../models/user.model.js";
import { profileUpdateSchema } from "@ecommerce/schemas/user";

const router: Router = express.Router();

// Public routes - no authentication required
router.get("/", getAllUsers as RequestHandler);
router.get("/:username", getUserByUsername as RequestHandler);
// router.put(
//   "/:id",
//   validateSchema(profileUpdateSchema),
//   updateUser as RequestHandler
// );
router.delete("/:id", deleteUser as RequestHandler);

export default router;
