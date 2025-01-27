import express, { Router } from "express";
import { createUser, getUser, updateUser } from "../controller/users";

const router: Router = express.Router();

router.post("/:id", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);

export default router;
