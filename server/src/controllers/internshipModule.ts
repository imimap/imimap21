import { Request, Response } from "express";
import { InternshipModule } from "../models/internshipModule";

export async function listAll(req: Request, res: Response): Promise<void> {
  /*const filter: FilterQuery<IInternshipModule> = {};
  console.log(req.query.semester);
  if (req.query.semester) filter.inSemester = req.query.semester as string;*/

  res.json(
    await InternshipModule.aggregate([
      {
        $project: {
          events: {
            $filter: {
              input: "$events",
              as: "event",
              cond: {
                $and: [
                  { $eq: ["$$event.accept", true] },
                  { $eq: ["$$event.changes.newSemester", req.query.semester] },
                ],
              },
            },
          },
          status: 1,
          internships: 1,
        },
      },
      {
        $match: {
          events: { $not: { $size: 0 } },
        },
      },
      {
        $project: {
          events: {
            $reduce: {
              input: "$events",
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
    ])
  );
}
