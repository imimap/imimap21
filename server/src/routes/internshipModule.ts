import { Router } from "express";
import { param, query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import { findInternshipModule, listInternshipModules } from "../controllers/internshipModule";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const internshipModuleRouter = Router();

internshipModuleRouter.get(
  "/",
  authMiddleware(true),
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  validate,
  asyncHandler(listInternshipModules)
);

internshipModuleRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(findInternshipModule)
);

export default internshipModuleRouter;
