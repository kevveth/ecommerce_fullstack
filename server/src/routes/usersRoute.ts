import express, { Router } from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controller/users";

const router: Router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
