import { NextFunction, Request, Response } from "express";
import { IInternshipModule, InternshipModule } from "../models/internshipModule";
import { FilterQuery } from "mongoose";
import {IUser, User} from "../models/user";
import {BadRequest, Forbidden, NotFound} from "http-errors";
import { Role } from "../authentication/user";
import {Internship} from "../models/internship";

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

export async function passAep(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).populate({
    path: "studentProfile",
    lean: true,
  });
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may mark the aep as passed"));

  if (!req.params.id)
    return next(
      new NotFound("Provide an id in the query to say for internship module to pass the AEP.")
    );
  const internshipToUpdate = await InternshipModule.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("InternshipModule not found"));

  const updatedInternship = await internshipToUpdate.passAep(user._id);
  res.json(updatedInternship);
}

export async function createInternshipModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).populate({
    path: "studentProfile",
    lean: true,
  });
  if (!user) return next(new NotFound("User not found"));

  let userToUpdate: IUser | null = user;

  if (user.isAdmin) {
    if (!req.query.id)
      return next(
        new NotFound(
          "Provide an id in the query to say for which student to create an internship module."
        )
      );
    userToUpdate = await User.findById(req.query.id);
    if (!userToUpdate) return next(new NotFound("User not found"));
  }

  if (!userToUpdate.studentProfile)
    return next(new NotFound("User does not seem to be a student."));

  if (userToUpdate.studentProfile.internship)
    return next(new NotFound("Student already has an internship module."));

  const newInternshipModule: IInternshipModule = new InternshipModule({});
  const createdInternshipModule = await newInternshipModule.plan();

  userToUpdate.studentProfile.internship = createdInternshipModule._id;
  await userToUpdate.save();

  res.json(createdInternshipModule);
}
