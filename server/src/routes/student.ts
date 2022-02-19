import { Router } from "express";
import { param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import {
  clearInternshipSearchHistory,
  getStudentById,
  getStudents,
  // getAllStudents,
} from "../controllers/student";
import { Semester } from "../helpers/semesterHelper";

const studentRouter = Router();

studentRouter.get(
  "/",
  authMiddleware(true),
  query("semester").toUpperCase().optional().custom(Semester.isValidSemesterString),
  query(["count", "offset"]).optional().isInt(),
  validate,
  asyncHandler(getStudents)
);

// studentRouter.get("/", authMiddleware(true), validate, asyncHandler(getAllStudents));

studentRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(getStudentById)
);

studentRouter.patch(
  "/:id/clear-search",
  authMiddleware(true),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(clearInternshipSearchHistory)
);

export default studentRouter;
