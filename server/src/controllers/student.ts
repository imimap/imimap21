import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { NotFound } from "http-errors";
import { constants } from "http2";

export async function getStudents(req: Request, res: Response): Promise<void> {
  const options: any = {
    studentProfile: {
      $ne: null,
    },
  };
  if (req.params.id) options._id = req.params.id;
  const users = await User.find(options);
  res.json(users);
}

export async function clearInternshipSearchHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findById(req.params.id);
  if (!user || !user.studentProfile)
    return next(new NotFound(`Student with id ${req.params.id} not found`));

  user.studentProfile.internshipsSeen = [];
  await user.save();
  res.statusCode = constants.HTTP_STATUS_NO_CONTENT;
  res.send();
}
