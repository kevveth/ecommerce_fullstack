import express from "express";
import usersRouter from "./usersRoute.js";
import adminRouter from "./adminRoute.js";

const router: express.Router = express.Router();

// Mount all API routes under /api
router.use("/admin", adminRouter);
router.use("/users", usersRouter);

export default router;
