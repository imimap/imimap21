import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { ldap as config } from "../config";
import { AuthUser, generateAuthToken } from "../authentication/user";
import { Unauthorized } from "http-errors";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  passport.authenticate(
    config.strategyName,
    { session: false },
    (error: unknown, user: AuthUser | null, info: { message: string }) => {
      if (error) return next(error);
      if (!user) return next(new Unauthorized(info.message));
      res.json({ token: generateAuthToken(user) });
    }
  )(req, res, next);
}
