import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { auth as config } from "../config";
import { generateAuthToken, Role } from "../authentication/user";
import { NotFound, Unauthorized } from "http-errors";
import { IUser, User } from "../models/user";
import { InternshipModule } from "../models/internshipModule";
import { IStudentProfile } from "../models/studentProfile";

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
  const isStudent = user.role === Role.STUDENT;
  return await User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.email,
    isAdmin: !isStudent,
    studentProfile: isStudent ? await createStudentProfile(user) : null,
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
      const userEntity = await User.findOne({ emailAddress: user.email });
      // Create user account if it doesn't exist
      if (!userEntity) await createUser(user);
      // Send auth token and user profile
      res.json({ token: generateAuthToken(user) });
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
