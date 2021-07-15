import { Router } from "express";
import { param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  createInternship,
  findInternships,
  generateRequestPdf,
  getAllOperationalAreas,
  getAllPaymentTypes,
  getAllProgrammingLanguages,
  getInternshipsById,
  updateInternship,
} from "../controllers/internship";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Semester } from "../helpers/semesterHelper";

const internshipRouter = Router();

internshipRouter.get(
  "/",
  authMiddleware(),
  query([
    "branchName",
    "companyName",
    "country",
    "industry",
    "mainLanguage",
    "operationalArea",
    "paymentType",
    "programmingLanguage",
    "size",
  ]).toUpperCase(),
  query(["semester"])
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  validate,
  asyncHandler(findInternships)
);

internshipRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(getInternshipsById)
);

internshipRouter.post(
  "/",
  authMiddleware(),
  query([
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
    "companyId",
  ]),
  validate,
  asyncHandler(createInternship)
);

internshipRouter.patch(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  query([
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
  ]),
  validate,
  asyncHandler(updateInternship)
);

/* PDF endpoints */
/*
internshipRouter.post(
  "/pdf/lsfEctsProof",
  authMiddleware(),
  validate,
  asyncHandler(submitLsfEctsProofPdf)
);
 */
/*
internshipRouter.post(
  "/pdf/locationJustification",
  authMiddleware(),
  validate,
  asyncHandler(submitlocationJustificationPdf)
);
 */
/*
internshipRouter.post(
  "/pdf/contract",
  authMiddleware(),
  validate,
  asyncHandler(submitContractPdf)
);
 */
/*
internshipRouter.post(
  "/pdf/bvgTicketExemption",
  authMiddleware(),
  validate,
  asyncHandler(submitBvgTicketExemptionPdf)
);
 */
/*
internshipRouter.post(
  "/pdf/certificate",
  authMiddleware(),
  validate,
  asyncHandler(submitCertificatePdf)
);
 */
/*
internshipRouter.post(
  "/pdf/reportPdf",
  authMiddleware(),
  validate,
  asyncHandler(submitReportPdf)
);
 */

/* The following endpoints can be used to provide options to a search form */

internshipRouter.get(
  "/properties/payment-types",
  authMiddleware(),
  validate,
  asyncHandler(getAllPaymentTypes)
);

internshipRouter.get(
  "/properties/operational-areas",
  authMiddleware(),
  validate,
  asyncHandler(getAllOperationalAreas)
);

internshipRouter.get(
  "/properties/programming-languages",
  authMiddleware(),
  validate,
  asyncHandler(getAllProgrammingLanguages)
);

internshipRouter.get(
  "/:id/generate/request",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  validate,
  asyncHandler(generateRequestPdf)
);

export default internshipRouter;
