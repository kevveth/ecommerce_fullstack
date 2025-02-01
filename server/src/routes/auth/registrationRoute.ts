//Router for registering a new user.
import express, { Router } from "express";
import { createUser } from "../../controller/users";
const router: Router = express.Router();


router.post("/", createUser);

export default router;
