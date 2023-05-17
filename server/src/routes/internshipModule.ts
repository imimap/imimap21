import { Router } from "express";
import { body, param, query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import {
  findInternshipModule,
  listInternshipModules,
  passAep,
  updateInternshipModule,
} from "../controllers/internshipModule";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { InternshipModuleStatuses } from "../models/internshipModule";

const internshipModuleRouter = Router();

internshipModuleRouter.get(
  "/",
  authMiddleware(true),
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  query("status")
    .optional()
    .custom((s) => Object.values(InternshipModuleStatuses).indexOf(s) !== -1),
  validate,
  asyncHandler(listInternshipModules)
);

internshipModuleRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => isObjectId(id) || id === "my"),
  validate,
  asyncHandler(findInternshipModule)
);

internshipModuleRouter.patch(
  "/:id/aep-passed/",
  authMiddleware(true),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(passAep)
);

/* Additional admin interface options */
internshipModuleRouter.patch(
  "/:id/",
  authMiddleware(true),
  param("id").custom(isObjectId),
  body(["internships", "inSemester", "inSemesterOfStudy", "aepPassed", "status"]),
  validate,
  asyncHandler(updateInternshipModule)
);

export default internshipModuleRouter;
