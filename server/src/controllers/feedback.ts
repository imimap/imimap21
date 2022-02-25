import { NextFunction, Request, Response } from "express";
import { Forbidden, NotFound, BadRequest } from "http-errors";
import { User } from "../models/user";
import { Feedback } from "../models/feedback";

function getFeedbackObject(propsObject: any) {
  const feedbackProps: { [k: string]: unknown } = {};

  //direct props of feedback
  const directProps = [
    "title",
    "explanation",
    "isFeedbackActive",
    "createdAt",
    "updatedAt",
  ];
  for (const prop of directProps) {
    if(propsObject[prop]) {
      feedbackProps[prop] = propsObject[prop];
      // console.log(feedbackProps[prop]);
      // console.log(propsObject[prop]);
      // console.log(prop);
    }
  }

  return feedbackProps;
}

/**
 * Returns all feedbacks to admins
 * @param req
 * @param res
 * @param next
 */
export async function getAllFeedbacks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  if (req.query.isFeedbackActive) return getAllActiveFeedbacks(req, res, next);

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all feedbacks."));

  const feedbacks = await Feedback.find();

  res.json(feedbacks);
}

/**
 * Returns all feedbacks to admins
 * @param req
 * @param res
 * @param next
 */
export async function getAllActiveFeedbacks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all feedbacks."));

  const feedbacks = await Feedback.find({isFeedbackActive: true}).exec();

  res.json(feedbacks);
}

/**
 * Returns a feedback to admins by its id
 * @param req
 * @param res
 * @param next
 */
export async function getFeedbackById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may see feedback in detail"));

  const feedbackId = req.params.id.toString();

  if (user.isAdmin) {
    const feedback = await Feedback.findById(feedbackId).lean();
    if (!feedback) return next(new NotFound("Feedback not found"));
    res.json(feedback);
  } else {
    return next(new Forbidden("You are not allowed to fetch this feedback"));
  }
}

/**
 * Creates new feedback
 * @param req
 * @param res
 * @param next
 */
export async function createFeedback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const feedbackProps = getFeedbackObject(req.body);
  const newFeedback = new Feedback(feedbackProps);
  const savedFeedback = await newFeedback.save();
  if (!savedFeedback) return next(new BadRequest("Could not create the requested feedback"));

  res.json(savedFeedback);
}

/**
 * Update feedback
 * @param req
 * @param res
 * @param next
 */
export async function updateFeedback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit feedbacks"));

  if (!req.params.id) return next(new BadRequest("Please provide a feedback id."));
  const feedbackToUpdate = await Feedback.findById(req.params.id);
  if (!feedbackToUpdate) return next(new NotFound("Feedback not found"));

  console.log(req.body.explanation);
  const feedbackProps = getFeedbackObject(req.body);
  for (const prop in feedbackProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    feedbackToUpdate[prop] = feedbackProps[prop];
  }
  const savedFeedback = await feedbackToUpdate.save();
  res.json(savedFeedback);
}

/**
 * delete feedback
 * @param req
 * @param res
 * @param next
 */
export async function deleteFeedbackById(
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit feedbacks"));

  if (!req.params.id) return next(new BadRequest("Please provide a feedback id."));
  console.log("id of Feedback: " + req.params.id);
  const feedbackToDelete = await Feedback.findById(req.params.id);
  if (!feedbackToDelete) return next(new NotFound("Feedback not found"));

  const deletedFeedback = await feedbackToDelete.deleteOne();

  res.json(deletedFeedback);
}
