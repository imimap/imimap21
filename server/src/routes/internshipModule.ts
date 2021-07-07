import { Router } from "express";
import { query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import { listAll } from "../controllers/internshipModule";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const internshipModuleRouter = Router();

internshipModuleRouter.get(
  "/",
  authMiddleware,
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  validate,
  asyncHandler(listAll)
);

export default internshipModuleRouter;
