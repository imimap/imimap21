import { NextFunction, Request, Response } from "express";
import { IInternshipModule, InternshipModule } from "../models/internshipModule";
import { FilterQuery } from "mongoose";
import { User } from "../models/user";
import { NotFound } from "http-errors";

export async function getMyInternshipModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email });
  if (!user || !user.studentProfile) return next(new NotFound("Student not found"));
  await user
    .populate({ path: "studentProfile.internship", populate: { path: "internships" } })
    .execPopulate();
  res.json(user.studentProfile.internship);
}

export async function listAll(req: Request, res: Response): Promise<void> {
  const filter: FilterQuery<IInternshipModule> = {};
  if (req.query.semester) filter.inSemester = req.query.semester as string;
  res.json(await InternshipModule.find(filter));
}

export async function listPostponementRequests(req: Request, res: Response): Promise<void> {
  res.json(
    await InternshipModule.aggregate([
      {
        $project: {
          postponementEvents: {
            $filter: {
              input: "$events",
              as: "event",
              cond: {
                $and: [
                  { $gt: ["$$event.changes.newSemester", null] },
                  { $or: [{ $eq: ["$$event.accept", false] }, { $lte: ["$$event.accept", null] }] },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          postponementEvents: { $not: { $size: 0 } },
        },
      },
      {
        $project: {
          postponementEvent: {
            $reduce: {
              input: "$postponementEvents",
              initialValue: 0,
              in: {
                $cond: {
                  if: { $gt: ["$$value.timestamp", "$$this.timestamp"] },
                  then: "$$value",
                  else: "$$this",
                },
              },
            },
          },
          status: 1,
          internships: 1,
        },
      },
      {
        $project: {
          newSemester: "$postponementEvent.changes.newSemester",
          newSemesterOfStudy: "$postponementEvent.changes.newSemesterOfStudy",
          reason: "$postponementEvent.changes.reason",
        },
      },
    ])
  );
}
