import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/users";

const router: Router = express.Router();

// router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
