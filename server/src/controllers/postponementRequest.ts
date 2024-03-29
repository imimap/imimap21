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
import { EventTypes } from "../models/event";

export async function listPostponementRequests(req: Request, res: Response): Promise<void> {
  const postponementRequests = await InternshipModule.aggregate([
    {
      // Match all internship modules with the status POSTPONEMENT_REQUESTED
      $match: {
        status: InternshipModuleStatuses.POSTPONEMENT_REQUESTED,
      },
    },
    {
      $project: {
        postponementEvent: {
          $reduce: {
            input: {
              // Find all events regarding postponement requests
              $filter: {
                input: "$events",
                as: "event",
                cond: {
                  $eq: ["$$event.type", EventTypes.INTERNSHIP_MODULE_POSTPONEMENT],
                },
              },
            },
            initialValue: 0,
            in: {
              // Reduce events list to the most recent entry
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
      "firstName lastName studentProfile.studentId"
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
  res.json({
    newSemester: req.body.newSemester,
    newSemesterOfStudy: req.body.newSemesterOfStudy,
    reason: req.body.reason,
  });
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

export async function editPostponementRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Get internship module by id
  const internshipModule = await InternshipModule.findById(req.params.id);
  if (!internshipModule)
    return next(new NotFound(`Internship module with id ${req.params.id} not found`));
  // Get admin user id
  const user = await User.findOne({ emailAddress: req.user?.email }).lean();
  // Accept or reject postponement
  try {
    const updatedInternshipModule = await internshipModule.editPostponement(user?._id, req.body);
    const updatedPostponementRequest = updatedInternshipModule.getRecentPostponementRequest();
    res.json({
      _id: updatedInternshipModule._id,
      newSemester: updatedPostponementRequest.changes?.newSemester,
      newSemesterOfStudy: updatedPostponementRequest.changes?.newSemesterOfStudy,
      reason: updatedPostponementRequest.comment,
    });
  } catch (e) {
    return next(new BadRequest(e.message));
  }
}
