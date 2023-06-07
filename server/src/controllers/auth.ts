import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { auth as config } from "../config";
import { generateAuthToken, generateRefreshToken, Role } from "../authentication/user";
import { NotFound, Unauthorized } from "http-errors";
import { IUser, User } from "../models/user";
import { InternshipModule } from "../models/internshipModule";
import { IStudentProfile } from "../models/studentProfile";
import * as jwt from "jsonwebtoken";

async function createStudentProfile(user: Express.User): Promise<IStudentProfile> {
  const internshipModule = await InternshipModule.create({
    internships: [],
    status: "unknown",
  });

  return {
    studentId: user.id,
    internship: internshipModule.id,
    companiesSeen: [],
  };
}

async function createUser(user: Express.User): Promise<IUser> {
  return await User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.email,
    isAdmin: false,
    studentProfile: user.role === Role.STUDENT ? await createStudentProfile(user) : null,
  });
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  passport.authenticate(
    config.strategy,
    { session: false },
    async (error: unknown, user: Express.User | null, info: { message: string }) => {
      if (error) return next(error);
      if (!user) return next(new Unauthorized(info.message));
      // User successfully authenticated, check if user exists
      let userEntity = await User.findOne({ emailAddress: user.email });
      // Create user account if it doesn't exist
      if (!userEntity) userEntity = await createUser(user);
      else user.role = userEntity.isAdmin ? Role.INSTRUCTOR : Role.STUDENT; //DS Update role from DB
      // Send auth token and user profile
      const token = generateAuthToken(user, userEntity._id);
      const refreshToken = generateRefreshToken(userEntity._id);
      res.json({ token, refreshToken });
    }
  )(req, res, next);
}

export async function profile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email });
  if (!user) return next(new NotFound("User not found"));
  res.json(user);
}

export async function editProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email });
  if (!user) return next(new NotFound("User not found"));

  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;

  res.json(await user.save());
}

export async function generateAccessTokenFromRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new NotFound("Refresh Token is required"));
  }

  try {
    const decoded = jwt.verify(refreshToken, config.refreshSecret) as jwt.JwtPayload;
    if ("userId" in decoded) {
      const userEntity = await User.findById(decoded.userId);
      if (!userEntity) {
        return next(new NotFound("User not found"));
      }

      // check if refresh token has expired
      const refreshTokenExpiration = decoded.exp ?? 0;
      if (refreshTokenExpiration < Date.now() / 1000) {
        throw new Error("Refresh token has expired");
      }

      const user: Express.User = {
        id: userEntity._id.toHexString(),
        email: userEntity.emailAddress,
        firstName: userEntity.firstName || "",
        lastName: userEntity.lastName || "",
        role: userEntity.isAdmin ? Role.INSTRUCTOR : Role.STUDENT,
      };
      const accessToken = generateAuthToken(user, userEntity._id);
      res.json({ accessToken });
    } else {
      throw new Error("Invalid or expired refresh token");
    }
  } catch (error) {
    console.error("Error generating access token from refresh token:", error);
    return next(new Unauthorized("Invalid or expired Refresh token!"));
  }
}
