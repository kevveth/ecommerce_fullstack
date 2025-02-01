import express, { Router } from 'express';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express-serve-static-core';

const router: Router = express.Router();

router.post(
  "/",
  passport.authenticate("local"),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.json("You logged in!");
  }
);

export default router