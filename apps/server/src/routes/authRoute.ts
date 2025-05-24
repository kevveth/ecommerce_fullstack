import express, { Router, RequestHandler } from "express";
import { registerUser } from "../controller/registerController";
import { loginUser } from "../controller/authController";
import { refreshToken } from "../controller/refreshTokenController";
import { logoutUser } from "../controller/logoutController";

const router: Router = express.Router();

// Fix route handlers by explicitly casting them to RequestHandler type
router.post("/register", registerUser as RequestHandler);
router.post("/login", loginUser as RequestHandler);
router.post("/refresh-token", refreshToken as RequestHandler);
router.post("/logout", logoutUser as RequestHandler);

export default router;
