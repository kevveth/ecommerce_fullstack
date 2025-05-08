import express from "express";
import authRouter from "./authRoute";
import usersRouter from "./usersRoute";
import adminRouter from "./adminRoute";

const router: express.Router = express.Router();

// Mount all API routes under /api
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);

export default router;
