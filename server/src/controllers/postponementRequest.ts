import { NextFunction, Request, Response } from "express";
import {
  IInternshipModule,
  InternshipModule,
  InternshipModuleStatuses,
} from "../models/internshipModule";
import { User } from "../models/user";
import { Role } from "../authentication/user";
import { BadRequest, Forbidden, NotFound } from "http-errors";
import { constants } from "http2";

export async function listPostponementRequests(req: Request, res: Response): Promise<void> {
  const postponementRequests = await InternshipModule.aggregate([
    {
      $match: {
        status: InternshipModuleStatuses.POSTPONEMENT_REQUESTED,
      },
    },
    {
      $project: {
        postponementEvent: {
          $reduce: {
            input: {
              $filter: {
                input: "$events",
                as: "event",
                cond: {
                  $and: [
                    { $gt: ["$$event.changes.newSemester", null] },
                    {
                      $or: [{ $eq: ["$$event.accept", false] }, { $lte: ["$$event.accept", null] }],
                    },
                  ],
                },
              },
            },
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
      },
    },
    {
      $project: {
        newSemester: "$postponementEvent.changes.newSemester",
        newSemesterOfStudy: "$postponementEvent.changes.newSemesterOfStudy",
        reason: "$postponementEvent.comment",
      },
    },
  ]);

  const requestsWithUsers = [];
  for (const request of postponementRequests) {
    request.user = await User.findOne(
      { "studentProfile.internship": request._id },
      "firstName lastName"
    );
    requestsWithUsers.push(request);
  }

  res.json(requestsWithUsers);
}

export async function createPostponementRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Don't allow users other than students to create postponement requests
  if (req.user?.role !== Role.STUDENT)
    return next(new Forbidden("Only students may create postponement requests"));
  // Get user's internship module
  const user = await User.findOne({ emailAddress: req.user?.email }).populate(
    "studentProfile.internship"
  );
  const internshipModule: IInternshipModule | null = user?.studentProfile?.internship;
  if (!internshipModule) return next(new NotFound("Internship module not found"));
  // Create new request
  try {
    await internshipModule?.requestPostponement(
      user?._id,
      req.body.newSemester as string,
      Number.parseInt(req.body.newSemesterOfStudy as string),
      req.body.reason as string
    );
  } catch (e) {
    return next(new BadRequest(e.message));
  }
  // Successfully created request, return 201 - CREATED
  res.statusCode = constants.HTTP_STATUS_CREATED;
  res.send();
}

export function processPostponementRequest(accept: boolean) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Get internship module by id
    const internshipModule = await InternshipModule.findById(req.params.id);
    if (!internshipModule)
      return next(new NotFound(`Internship module with id ${req.params.id} not found`));
    // Get admin user id
    const user = await User.findOne({ emailAddress: req.user?.email }).lean();
    // Accept or reject postponement
    try {
      if (accept) await internshipModule.acceptPostponement(user?._id, req.body.reason);
      else await internshipModule.rejectPostponement(user?._id, req.body.reason);
    } catch (e) {
      return next(new BadRequest(e.message));
    }
    // Successfully processed request, return 204 - No content
    res.statusCode = constants.HTTP_STATUS_NO_CONTENT;
    res.send();
  };
}
