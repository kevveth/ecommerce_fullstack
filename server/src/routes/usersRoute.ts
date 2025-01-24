import express from "express";
import { getHandler } from "../controller/users";

const router = express.Router();

router.get("/:id", getHandler);

export default router;
