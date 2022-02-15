import { Router } from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  createInternship,
  findInternships, findInternshipsAmount, findInternshipsSeenAmount,
  getInternshipLocations,
  getInternshipsById,
  submitPdf,
  updateInternship,
} from "../controllers/internship";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Semester } from "../helpers/semesterHelper";
import validator from "validator";
import isBoolean = validator.isBoolean;

const internshipRouter = Router();

const standardQueryParams = [
  "branchName",
  "companyName",
  "country",
  "industry",
  "mainLanguage",
  "operationalArea",
  "paymentType",
  "programmingLanguage",
  "size",
];

internshipRouter.get(
  "/",
  authMiddleware(),
  query(standardQueryParams).toUpperCase(),
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  query("seen")
    .toLowerCase()
    .custom((s) => (s ? isBoolean(s) : true)),
  validate,
  asyncHandler(findInternships)
);

internshipRouter.get(
  "/amount",
  authMiddleware(),
  query(standardQueryParams).toUpperCase(),
  validate,
  asyncHandler(findInternshipsAmount)
);

internshipRouter.get(
  "/seen/amount",
  authMiddleware(),
  validate,
  asyncHandler(findInternshipsSeenAmount)
);

// @TODO: Wäre praktisch wenn die Company hier direkt gepopulated werden würde
internshipRouter.get(
  "/locations",
  authMiddleware(),
  query("semester")
    .toUpperCase()
    .optional()
    .custom((s) => Semester.isValidSemesterString(s) || s === ""),
  validate,
  asyncHandler(getInternshipLocations)
);

internshipRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => isObjectId(id) || id === "my" || id === "random"),
  validate,
  asyncHandler(getInternshipsById)
);

const standardPostParams = [
  "startDate",
  "endDate",
  "tasks",
  "operationalArea",
  "livingCosts",
  "salary",
  "workingHoursPerWeek",
  "programmingLanguages", //array
  "paymentTypes", //enum, array
  //supervisor
  "supervisorFullName",
  "supervisorEmailAddress",
];

internshipRouter.post(
  "/",
  authMiddleware(),
  body(standardPostParams.concat("companyId")),
  validate,
  asyncHandler(createInternship)
);

internshipRouter.patch(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  query(standardPostParams),
  validate,
  asyncHandler(updateInternship)
);

/* PDF endpoints */
const idRegEx = /[0-9a-f]{24}/;

internshipRouter.post(
  "/:id/pdf/request",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("requestPdf"))
);

internshipRouter.post(
  "/:id/pdf/lsfEctsProof",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("lsfEctsProofPdf"))
);

internshipRouter.post(
  "/:id/pdf/locationJustification",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("locationJustificationPdf"))
);

internshipRouter.post(
  "/:id/pdf/contract",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("contractPdf"))
);

internshipRouter.post(
  "/:id/pdf/bvgTicketExemption",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("bvgTicketExemptionPdf"))
);

internshipRouter.post(
  "/:id/pdf/certificate",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("certificatePdf"))
);

internshipRouter.post(
  "/:id/pdf/report",
  authMiddleware(),
  param("id").custom((id) => idRegEx.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("reportPdf"))
);

export default internshipRouter;
