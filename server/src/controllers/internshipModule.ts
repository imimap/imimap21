import { NextFunction, Request, Response } from "express";
import { IInternshipModule, InternshipModule } from "../models/internshipModule";
import { FilterQuery } from "mongoose";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { Role } from "../authentication/user";

export async function findInternshipModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).populate({
    path: "studentProfile.internship",
    populate: { path: "internships", lean: true },
    lean: true,
  });
  if (req.params.id === "my") {
    if (!user || !user.studentProfile) return next(new NotFound("Student not found"));
    res.json(user.studentProfile.internship);
  } else {
    if (req.user?.role !== Role.INSTRUCTOR && user?.studentProfile?.internship.id !== req.params.id)
      return next(new Forbidden("You may only access your own internship module"));
    const internshipModule = await InternshipModule.findById(req.params.id)
      .populate({ path: "internships", lean: true })
      .lean();
    if (!internshipModule) return next(new NotFound("Internship module not found"));
    res.json(internshipModule);
  }
}

export async function listInternshipModules(req: Request, res: Response): Promise<void> {
  const filter: FilterQuery<IInternshipModule> = {};
  if (req.query.semester) filter.inSemester = req.query.semester as string;
  res.json(await InternshipModule.find(filter).lean());
}
