import * as passportStrategy from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { Express, Request, Response, NextFunction } from "express";
import { User } from "../types/user";
import { getWithEmail, UserResult } from "../models/users";
import UnauthorizedError from "../errors/UnauthorizedError";

export function initPassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportStrategy.Strategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (!email) done(null, false);

          const result: UserResult = await getWithEmail(email);
          const user: User = result.user!;
          if (
            user.email === email &&
            (await bcrypt.compare(password, user.password_hash.toString()))
          ) {
            done(null, user);
          } else {
            done(null, false, { message: "Email or password incorrect" });
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user: User, done) => {
    const u = await getWithEmail(user.email);
    done(null, u);
  });
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    return next();
  } else {
    const err = new UnauthorizedError({
      message: "You are not authenticated!",
      logging: true,
    });
    return next(err);
  }
}
