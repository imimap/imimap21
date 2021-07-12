import { Router } from "express";
import { param, query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const studentRouter = Router();

studentRouter.get(
  "/",
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  validate,
  asyncHandler()
);

export default studentRouter;
