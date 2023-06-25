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
  let semesters = [Semester.getCurrent()];

  for (let i = 0; i < count; i++) semesters.push(semesters[i].next());

  semesters = semesters.slice(1);

  res.json(semesters.map((s) => s.toString()));
}

/**
 * Returns a list of past semesters that contain internships
 * @param req
 * @param res
 */
export async function getSemesters(req: Request, res: Response): Promise<void> {
  let llist = await InternshipModule.distinct("inSemester").lean();
  llist = llist.sort((a,b)=>{
    let diff = b.slice(2) - a.slice(2);
    if(diff==0)return a[0]=="W" ? 1:-1;
    else return diff;
  })
  
  res.json(llist);
}

export async function getCurrentSemester(req: Request, res: Response): Promise<void> {
  res.json(Semester.getCurrent().toString());
}

export function getLanguages(req: Request, res: Response): void {
  res.json(isoLanguages);
}
