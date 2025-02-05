import * as passportStrategy from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { Express, Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { getWithEmail } from "../services/users";
import UnauthorizedError from "../errors/UnauthorizedError";

export function initPassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportStrategy.Strategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (!email)
            return done(null, false, { message: "Email is required" });

          const user = await getWithEmail(email);

          if (!user) return done(null, false, { message: "User not found" });

          if (!password)
            return done(null, false, { message: "Password is required" });

          const match = await bcrypt.compare(password, user.password_hash);
          if (!match) return done(null, false, { message: "Invalid password" });

          return done(null, user);
        } catch (err) {
          return done(err);
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
