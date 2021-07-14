import { Router } from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  createInternship,
  findInternships,
  getAllOperationalAreas,
  getAllPaymentTypes,
  getAllProgrammingLanguages,
  getInternshipsById,
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

// @TODO: Wäre praktisch wenn die Company hier direkt gepopulated werden würde
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
  body([
    "startDate",
    "endDate",
    "tasks",
    "operationalArea",
    "livingCosts",
    "salary",
    "workingHoursPerWeek",
    "supervisor",
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

export default internshipRouter;
