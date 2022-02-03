import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluationById,
} from "../controllers/evaluation";

const evaluationRouter = Router();

evaluationRouter.get(
  "/",
  authMiddleware(),
  query(["inSemester", "questions", "isPublished","createdAt", "updatedAt",]),
  validate,
  asyncHandler(getAllEvaluations)
);

evaluationRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(getEvaluationById)
);

evaluationRouter.post(
  "/",
  authMiddleware(),
  query([
    //evaluation
    "inSemester",
    "questions",
    "isPublished",
    "createdAt",
    "updatedAt",
  ]),
  validate,
  asyncHandler(createEvaluation)
);

evaluationRouter.patch(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  query([
    //evaluation
    "inSemester",
    "questions",
    "isPublished",
    "createdAt",
    "updatedAt",
  ]),
  validate,
  asyncHandler(updateEvaluation)
);

evaluationRouter.delete(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(deleteEvaluationById)
);

export default evaluationRouter;
