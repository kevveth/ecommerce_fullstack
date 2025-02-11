import express, { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserByUsername,
  updateUser,
} from "../controller/users";
import { validateUpdateData } from "../validation/user.validation";

const router: Router = express.Router();

// router.get("/:id", getUser);
router.get('/', getAllUsers);
router.get("/:username", getUserByUsername);
router.put("/:id", validateUpdateData, updateUser);
router.delete("/:id", deleteUser);

export default router;
