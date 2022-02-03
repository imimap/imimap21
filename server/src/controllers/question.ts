import { NextFunction, Request, Response } from "express";
import { Forbidden, NotFound, BadRequest } from "http-errors";
import { User } from "../models/user";
import { Question } from "../models/question";

function getQuestionObject(propsObject: any) {
  const questionProps: { [k: string]: unknown } = {};

  //direct props of question
  const directProps = [
    "title",
    "textContent",
    "isQuestionActive",
    "createdAt",
    "updatedAt",
    "dateToPublishQuestion",
    "answerTextContent",
    "answerUpdatedAt",
    "studentAllowsToPublish",
    "isAnswerReviewed",
    "isAnswerPublished",
  ];

  console.log("This is props: " + propsObject);

  for (const prop of directProps) {
    if(propsObject[prop]) {
      questionProps[prop] = propsObject[prop];
      // console.log(questionProps[prop]);
      // console.log(propsObject[prop]);
      // console.log(prop);
    }
  }

  return questionProps;
}

/**
 * Returns all questions to admins
 * @param req
 * @param res
 * @param next
 */
export async function getAllQuestions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  if (req.query.isQuestionActive) return getAllActiveQuestions(req, res, next);

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all questions."));

  const questions = await Question.find();

  res.json(questions);
}

/**
 * Returns all questions to admins
 * @param req
 * @param res
 * @param next
 */
export async function getAllActiveQuestions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all questions."));

  const questions = await Question.find({isQuestionActive: true}).exec();

  res.json(questions);
}

/**
 * Returns a question to admins by its id
 * @param req
 * @param res
 * @param next
 */
export async function getQuestionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may question in detail"));

  const questionId = req.params.id.toString();

  if (user.isAdmin) {
    const question = await Question.findById(questionId).lean();
    if (!question) return next(new NotFound("Question not found"));
    res.json(question);
  } else {
    return next(new Forbidden("You are not allowed to fetch this question"));
  }
}

/**
 * Creates new question
 * @param req
 * @param res
 * @param next
 */
export async function createQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const questionProps = getQuestionObject(req.body);
  const newQuestion = new Question(questionProps);
  const savedQuestion = await newQuestion.save();
  if (!savedQuestion) return next(new BadRequest("Could not create the requested question"));

  res.json(savedQuestion);
}

/**
 * Update question
 * @param req
 * @param res
 * @param next
 */
export async function updateQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit questions"));

  if (!req.params.id) return next(new BadRequest("Please provide a question id."));
  const questionToUpdate = await Question.findById(req.params.id);
  if (!questionToUpdate) return next(new NotFound("Question not found"));

  const questionProps = getQuestionObject(req.body);
  console.log(req.body);
  for (const prop in questionProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    questionToUpdate[prop] = questionProps[prop];
  }
  const savedQuestion = await questionToUpdate.save();
  res.json(savedQuestion);
}

/**
 * delete question
 * @param req
 * @param res
 * @param next
 */
export async function deleteQuestionById(
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit questions"));

  if (!req.params.id) return next(new BadRequest("Please provide a question id."));
  console.log("id of Question: " + req.params.id);
  const questionToDelete = await Question.findById(req.params.id);
  if (!questionToDelete) return next(new NotFound("Question not found"));

  const deletedQuestion = await questionToDelete.deleteOne();

  res.json(deletedQuestion);
}
