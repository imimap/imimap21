import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { auth as config } from "../config";
import { AuthUser, generateAuthToken, Role } from "../authentication/user";
import { Unauthorized } from "http-errors";
import { IUser, User } from "../models/user";
import { InternshipModule } from "../models/internshipModule";
import { IStudentProfile } from "../models/studentProfile";

async function createStudentProfile(user: AuthUser): Promise<IStudentProfile> {
  const internshipModule = await InternshipModule.create({
    internships: [],
  });

  return {
    studentId: user.id,
    internship: internshipModule.id,
    internshipsSeen: [],
  };
}

async function getUser(user: AuthUser): Promise<IUser> {
  const isStudent = user.role === Role.STUDENT;
  // TODO: Add correct filter for instructor accounts
  const userFilter = isStudent ? { "studentProfile.studentId": user.id } : {};
  // Try to fetch user from the database
  const foundUser = await User.findOne(userFilter);
  if (foundUser) return foundUser;

  // User doesn't exist yet, create a new user
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
    async (error: unknown, user: AuthUser | null, info: { message: string }) => {
      if (error) return next(error);
      if (!user) return next(new Unauthorized(info.message));
      // User successfully authenticated, get user from database
      const userEntity = await getUser(user);
      // Send auth token and user profile
      res.json({ token: generateAuthToken(user), user: userEntity });
    }
  )(req, res, next);
}
