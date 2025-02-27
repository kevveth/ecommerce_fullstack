import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { registerUser } from "../controller/registerController";
import { loginUser } from "../controller/authController";
import { refreshToken } from "../controller/refreshTokenController";
import { logoutUser } from "../controller/logoutController";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router;
