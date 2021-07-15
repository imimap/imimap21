import { Request, Response } from "express";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { isoLanguages } from "../helpers/isoLanguages";

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
