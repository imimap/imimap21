import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestionById,
} from "../controllers/question";

const questionRouter = Router();

questionRouter.get(
  "/",
  authMiddleware(),
  query([
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
  ]),
  validate,
  asyncHandler(getAllQuestions)
);

questionRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(getQuestionById)
);

questionRouter.post(
  "/",
  authMiddleware(),
  query([
    //question
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
  ]),
  validate,
  asyncHandler(createQuestion)
);

questionRouter.patch(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  query([
    //question
    "title",
    "textContent",
    "isQuestionActive",
    "updatedAt",
    "dateToPublishQuestion",
    "answerTextContent",
    "answerUpdatedAt",
    "studentAllowsToPublish",
    "isAnswerReviewed",
    "isAnswerPublished",
  ]),
  validate,
  asyncHandler(updateQuestion)
);

questionRouter.delete(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(deleteQuestionById)
);



export default questionRouter;
