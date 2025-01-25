import express from "express";
import { getUserWithId } from "../controller/users";

const router = express.Router();

router.get("/:id", getUserWithId);

export default router;
