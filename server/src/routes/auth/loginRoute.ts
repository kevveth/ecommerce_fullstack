import exp from 'constants';
import express, { Router } from 'express';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express-serve-static-core';

const router: Router = express.Router();

router.post(
  "/",
  passport.authenticate("local"),
  async (req: Request, res: Response, next: NextFunction) => {
    res.json("You logged in!");
    console.log(req.body);
  }
);

export default router