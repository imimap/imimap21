import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";

export async function getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  const options: any = {
    studentProfile: {
      $ne: null,
    },
  };
  if (req.params.id) options._id = req.params.id;
  const users = await User.find(options);
  res.json(users);
}

export async function getStudentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all student details."));

  const studentId = req.params.id.toString();

  if (user.isAdmin) {
    const student = await User.findById(studentId).lean();
    if (!student) return next(new NotFound("Student not found"));
    res.json(student);
  } else {
    return next(new Forbidden("You are not allowed to fetch student details."));
  }
}
