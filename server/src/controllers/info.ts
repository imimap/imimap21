import { NextFunction, Request, Response } from "express";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { isoLanguages } from "../helpers/isoLanguages";
import {User} from "../models/user";
import {Forbidden, NotFound} from "http-errors";
import {Evaluation} from "../models/evaluation";

/**
 * Returns a list of upcoming semesters, containing the current
 * semester + <count | 3> additional semesters
 * @param req
 * @param res
 */
export function getUpcomingSemesters(req: Request, res: Response): void {
  const count = Number.parseInt(req.query.count as string);
  const semesters = [Semester.getCurrent()];

  for (let i = 0; i < count; i++) semesters.push(semesters[i].next());

  res.json(semesters.map((s) => s.toString()));
}

/**
 * Returns a list of past semesters that contain internships
 * @param req
 * @param res
 */
export async function getSemesters(req: Request, res: Response): Promise<void> {
  res.json(await InternshipModule.distinct("inSemester").lean());
}

export function getLanguages(req: Request, res: Response): void {
  res.json(isoLanguages);
}

/**
 * Returns all possible semester to publish an evaluation to show to admins
 * @param req
 * @param res
 * @param next
 */
export async function getPossibleSemester(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get this."));

  const currentSemester = Semester.getCurrent().toString();
  const upcomingSemester = Semester.getUpcoming().toString();
  const evaluationCurrentSemester = await Evaluation.findOne({inSemester: currentSemester.toString()}).exec();
  const evaluationUpcomingSemester = await Evaluation.findOne({inSemester: upcomingSemester.toString()}).exec();

  let semesters = [];
  if(evaluationCurrentSemester == null) {
    semesters.push(currentSemester.toString());
  }
  if(evaluationUpcomingSemester == null) {
    semesters.push(upcomingSemester.toString());
  }
  console.log(semesters);
  res.json(semesters);
}
