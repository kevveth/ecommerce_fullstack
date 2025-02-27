// routes/admin.ts
import express, { Router } from "express";
import { Request, Response } from "express";
import { authenticate, authorize } from "../middleware/verifyJWT";

const router: Router = express.Router();

// Example: GET /api/admin/dashboard - Requires authentication and 'admin' role
router.get(
  "/dashboard",
  //@ts-ignore
  authenticate,
  authorize("admin"),
  (req: Request, res: Response) => {
    // Only admins can reach this point.  req.user will be available.
    res.json({ message: "Admin dashboard data", user: req.user });
  }
);

export default router;
