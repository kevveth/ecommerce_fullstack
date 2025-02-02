//Router for registering a new user.
import express, { Router } from "express";
import { registerUser } from "../../controller/register";
const router: Router = express.Router();

router.post("/", registerUser);

export default router;
