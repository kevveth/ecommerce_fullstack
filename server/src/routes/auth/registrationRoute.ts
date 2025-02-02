//Router for registering a new user.
import express, { Router } from "express";
import { validateRegistrationData } from "../../validation/user.validation";
import { registerUser } from "../../controller/register";
const router: Router = express.Router();

router.post("/", validateRegistrationData, registerUser);

export default router;
