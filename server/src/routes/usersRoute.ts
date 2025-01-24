import express from "express";
import * as usersController from "../controller/users";

const router = express.Router();

router.get("/:id", usersController.getHandler);

export default router;
