import { Router } from "express";
import { param } from "express-validator";
import authMiddleware from "../authentication/middleware";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { clearInternshipSearchHistory, getStudents } from "../controllers/student";

const studentRouter = Router();

studentRouter.get("/", authMiddleware(true), validate, asyncHandler(getStudents));

studentRouter.patch(
  "/:id/clear-search",
  authMiddleware(true),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(clearInternshipSearchHistory)
);

export default studentRouter;
