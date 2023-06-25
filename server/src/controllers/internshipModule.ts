import { NextFunction, Request, Response } from "express";
import { IInternshipModule, InternshipModule, InternshipModuleStatuses } from "../models/internshipModule";
import { FilterQuery } from "mongoose";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { Role } from "../authentication/user";
import { EventTypes, IEvent } from "../models/event";
import Responses from "../helpers/responses";

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
    res.json(Responses.fromInternshipModule(user.studentProfile.internship, user.isAdmin));
  } else {
    if (req.user?.role !== Role.INSTRUCTOR && user?.studentProfile?.internship.id !== req.params.id)
      return next(new Forbidden("You may only access your own internship module"));
    const internshipModule = await InternshipModule.findById(req.params.id)
      .populate({ path: "internships", lean: true })
      .lean();
    if (!internshipModule) return next(new NotFound("Internship module not found"));
    res.json(Responses.fromInternshipModule(internshipModule, user?.isAdmin));
  }
}

export async function listInternshipModules(req: Request, res: Response): Promise<void> {
  const filter: FilterQuery<IInternshipModule> = {};
  if (req.query.semester) filter.inSemester = req.query.semester as string;
  if (req.query.status) filter.status = req.query.status as string;
  const internshipModules = await InternshipModule.find(filter).lean();
  res.json(internshipModules.map((i) => Responses.fromInternshipModule(i, true)));
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
  res.json(Responses.fromInternshipModule(updatedInternship, user.isAdmin));
}

export async function updateInternshipModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean();
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit an Internship Module"));

  if (!req.params.id)
    return next(
      new NotFound("Provide an id in the query to say which internship module to update.")
    );
  const internshipToUpdate = await InternshipModule.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("InternshipModule not found"));

  const possibleProperties = [
    "internships",
    "inSemester",
    "inSemesterOfStudy",
    "aepPassed",
    "status",
  ];

  const changes: { [key: string]: unknown } = {};

  for (const prop of possibleProperties) {
    if (req.body[prop] !== undefined) {
      changes[prop] = req.body[prop];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      internshipToUpdate[prop] = req.body[prop];
    }
  }

  const newEvent: IEvent = {
    type: EventTypes.INTERNSHIP_MODULE_UPDATE,
    creator: user._id,
    changes: changes,
    comment: req.query.comment?.toString() || "Admin forced changes",
  };

  internshipToUpdate.events.push(newEvent);
  const internshipSaved = await internshipToUpdate.save();

  res.json(Responses.fromInternshipModule(internshipSaved, user.isAdmin));
}

export async function setInternshipModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean();
  if (!user) return next(new NotFound("User not found"));

  const internshipToUpdate = await InternshipModule.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("InternshipModule not found"));
  internshipToUpdate.status= InternshipModuleStatuses.PLANNED;
  internshipToUpdate.events.push({
    type: EventTypes.INTERNSHIP_MODULE_UPDATE,
    creator: user._id,
    accept: true,
    changes: {
      newSemester: req.body["inSemester"],
      newSemesterOfStudy: req.body["inSemesterOfStudy"],
      status: InternshipModuleStatuses.PLANNED,
    },
  });

  internshipToUpdate.inSemester = req.body["inSemester"];
  internshipToUpdate.inSemesterOfStudy = req.body["inSemesterOfStudy"];
  console.log(internshipToUpdate);
  
  const internshipSaved = await internshipToUpdate.save();

  res.json(Responses.fromInternshipModule(internshipSaved, false));
}
