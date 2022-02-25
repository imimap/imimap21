import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedbackById,
  getAllFeedbacks,
} from "../controllers/feedback";

const feedbackRouter = Router();

feedbackRouter.get(
  "/",
  authMiddleware(),
  query([
    "title",
    "explanation",
    "isFeedbackActive",
    "createdAt",
    "updatedAt",
  ]),
  validate,
  asyncHandler(getAllFeedbacks)
);

feedbackRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(getFeedbackById)
);

feedbackRouter.post(
  "/",
  authMiddleware(),
  query([
    //feedback
    "title",
    "explanation",
    "isFeedbackActive",
    "createdAt",
    "updatedAt",
  ]),
  validate,
  asyncHandler(createFeedback)
);

feedbackRouter.patch(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  query([
    //feedback
    "title",
    "explanation",
    "isFeedbackActive",
    "updatedAt",
  ]),
  validate,
  asyncHandler(updateFeedback)
);

feedbackRouter.delete(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(deleteFeedbackById)
);

export default feedbackRouter;
