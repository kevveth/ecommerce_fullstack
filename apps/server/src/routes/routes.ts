import express from "express";
import usersRouter from "./usersRoute.js";
import adminRouter from "./adminRoute.js";
import { signUpController } from "@/controllers/auth/sign-up.ts";
const router: express.Router = express.Router();

// Mount all API routes under /api
router.use("/admin", adminRouter);
router.use("/users", usersRouter);
router.use("/auth/sign-up", signUpController);

export default router;
