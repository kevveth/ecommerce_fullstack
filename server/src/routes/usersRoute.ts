import express, { Router } from "express";
import { getUser } from "../controller/users";

const router: Router = express.Router();

router.get("/:id", getUser);

export default router;
