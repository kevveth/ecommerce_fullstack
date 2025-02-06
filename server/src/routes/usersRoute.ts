import express, { Router } from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controller/users";
import { validateUpdateData } from "../validation/user.validation";

const router: Router = express.Router();

router.get("/:id", getUser);
router.put("/:id", validateUpdateData, updateUser);
router.delete("/:id", deleteUser);

export default router;
