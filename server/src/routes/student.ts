import { Router } from "express";
import { param } from "express-validator";
import authMiddleware from "../authentication/middleware";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { getStudentById, getStudents } from "../controllers/student";
import { clearInternshipSearchHistory, getStudents } from "../controllers/student";

const studentRouter = Router();

studentRouter.get("/", authMiddleware(true), validate, asyncHandler(getStudents));

studentRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
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
