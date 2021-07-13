import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

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
