import { Router } from "express";
import authMiddleware from "../authentication/middleware";
import * as asyncHandler from "express-async-handler";
import {
  createPostponementRequest,
  listPostponementRequests,
  processPostponementRequest,
} from "../controllers/postponementRequest";
import { isObjectId, validate } from "../helpers/validation";
import { body, param } from "express-validator";
import { Semester } from "../helpers/semesterHelper";

const postponementRequestRouter = Router();

postponementRequestRouter.get("/", authMiddleware(true), asyncHandler(listPostponementRequests));

postponementRequestRouter.post(
  "/",
  authMiddleware(),
  body("newSemester").custom(Semester.isValidSemesterString),
  body("newSemesterOfStudy").isInt({ gt: 1 }),
  body("reason").isString().notEmpty(),
  validate,
  asyncHandler(createPostponementRequest)
);

postponementRequestRouter.patch(
  "/:id/accept",
  authMiddleware(true),
  param("id").custom(isObjectId),
  body("reason").isString().optional(),
  validate,
  asyncHandler(processPostponementRequest(true))
);

postponementRequestRouter.patch(
  "/:id/reject",
  authMiddleware(true),
  param("id").custom(isObjectId),
  body("reason").isString().optional(),
  validate,
  asyncHandler(processPostponementRequest(false))
);

export default postponementRequestRouter;
