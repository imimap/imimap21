import { NextFunction, Request, Response } from "express";
import { Forbidden, NotFound, BadRequest } from "http-errors";
import { User } from "../models/user";
import { Evaluation } from "../models/evaluation";
import {Internship} from "../models/internship";

function getEvaluationObject(propsObject: any) {
  const evaluationProps: { [k: string]: unknown } = {};

  //direct props of evaluation
  const directProps = [
    "inSemester",
    "questions",
    "isPublished",
    "createdAt",
    "updatedAt",
  ];

  console.log("This is props: " + propsObject);

  for (const prop of directProps) {
    if(propsObject[prop]) {
      evaluationProps[prop] = propsObject[prop];
    }
  }

  return evaluationProps;
}

/**
 * Returns all evaluation to admins
 * @param req
 * @param res
 * @param next
 */
export async function getAllEvaluations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all evaluations."));

  const evaluationsMap = new Map();
  const evaluations = await Evaluation.find();

  for(const evaluation of evaluations) {
    let total = await Internship.find({ 'evaluationFile.inSemester': (await evaluation).inSemester }).countDocuments();
    console.log(total);
    evaluationsMap.set(evaluation, total);
  }

  res.json(Array.from(evaluationsMap));
}

/**
 * Returns an evaluation to admins by its id
 * @param req
 * @param res
 * @param next
 */
export async function getEvaluationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may evaluation in detail"));

  const evaluationId = req.params.id.toString();

  if (user.isAdmin) {
    const evaluation = await Evaluation.findById(evaluationId).lean();
    if (!evaluation) return next(new NotFound("Evaluation not found"));
    res.json(evaluation);
  } else {
    return next(new Forbidden("You are not allowed to fetch this evaluation"));
  }
}

// /**
//  * Returns an evaluation to admins by its id
//  * @param req
//  * @param res
//  * @param next
//  */
// export async function getEvaluationByInSemester(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("studentProfile");
//   if (!user) return next(new NotFound("User not found"));
//   if (!user.studentProfile) return next(new Forbidden("Only logged in student may evaluation in detail"));
//
//   const requestedSemester = req.params.inSemester.toString();
//
//   if (user.is) {
//     const evaluation = await Evaluation.findById(evaluationId).lean();
//     if (!evaluation) return next(new NotFound("Evaluation not found"));
//     res.json(evaluation);
//   } else {
//     return next(new Forbidden("You are not allowed to fetch this evaluation"));
//   }
// }

/**
 * Creates new evaluation
 * @param req
 * @param res
 * @param next
 */
export async function createEvaluation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const evaluationProps = getEvaluationObject(req.body);
  const newEvaluation = new Evaluation(evaluationProps);
  const savedEvaluation = await newEvaluation.save();
  if (!savedEvaluation) return next(new BadRequest("Could not create the requested evaluation"));

  res.json(savedEvaluation);
}

/**
 * Update evaluation
 * @param req
 * @param res
 * @param next
 */
export async function updateEvaluation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit evaluation"));

  if (!req.params.id) return next(new BadRequest("Please provide an evaluation id."));
  const evaluationToUpdate = await Evaluation.findById(req.params.id);
  if (!evaluationToUpdate) return next(new NotFound("Evaluation not found"));

  const evaluationProps = getEvaluationObject(req.body);
  console.log(req.body);
  for (const prop in evaluationProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    evaluationToUpdate[prop] = evaluationProps[prop];
  }
  const savedEvaluation = await evaluationToUpdate.save();
  res.json(savedEvaluation);
}

/**
 * delete evaluation
 * @param req
 * @param res
 * @param next
 */
export async function deleteEvaluationById(
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit evaluation"));

  if (!req.params.id) return next(new BadRequest("Please provide a evaluation id."));
  console.log("id of Evaluation: " + req.params.id);
  const evaluationToDelete = await Evaluation.findById(req.params.id);
  if (!evaluationToDelete) return next(new NotFound("Evaluation not found"));

  const deletedEvaluation = await evaluationToDelete.deleteOne();

  res.json(deletedEvaluation);
}
