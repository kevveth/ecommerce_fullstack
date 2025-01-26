import express, { Router } from "express";
import { getUser, updateUser } from "../controller/users";

const router: Router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);

export default router;
