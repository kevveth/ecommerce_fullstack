// routes/admin.ts
import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

// Example: GET /api/admin/dashboard - Currently public (will be protected with new auth strategy)
router.get("/dashboard", (req: Request, res: Response) => {
  // TODO: Add authentication and authorization with new auth strategy
  res.json({
    message: "Admin dashboard data",
    note: "This endpoint is temporarily public - auth to be implemented",
  });
});

export default router;
