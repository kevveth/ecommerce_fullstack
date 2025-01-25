import express from "express";
import usersRouter from "./usersRoute";


const router = express.Router();

// Mount all API routes under /api
router.use("/users", usersRouter);

export default router;
