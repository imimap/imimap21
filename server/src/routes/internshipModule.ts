import { Router } from "express";
import { param, query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import {
  findInternshipModule,
  listInternshipModules,
  passAep,
  updateInternshipModule,
} from "../controllers/internshipModule";
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

internshipModuleRouter.patch(
  "/:id/aep-passed/",
  authMiddleware(true),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(passAep)
);

/*
internshipModuleRouter.post(
  "/:id/pdf/report",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(submitReportPdf)
);
 */
/*
internshipModuleRouter.patch(
  "/:id/pdf/report/accepted",
  authMiddleware(true),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(acceptReportPdf)
);
 */
/*
internshipModuleRouter.patch(
  "/:id/pdf/report/rejected",
  authMiddleware(true),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(rejectReportPdf)
);
 */
/*
internshipModuleRouter.get(
  "/:id/pdf/report/",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(getReportPdf)
);
 */
/*
internshipModuleRouter.get(
  "/:id/pdf/complete/",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(getCompleteDocumentsPdf)
);
 */

/* Additional admin interface options */
internshipModuleRouter.patch(
  "/:id/",
  authMiddleware(true),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  query([
    "internships",
    "inSemester",
    "inSemesterOfStudy",
    "aepPassed",
    "reportPdf",
    "completeDocumentsPdf",
    "status",
  ]),
  validate,
  asyncHandler(updateInternshipModule)
);

export default internshipModuleRouter;
