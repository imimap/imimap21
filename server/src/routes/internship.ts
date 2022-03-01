import { Router } from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  createInternship,
  findInternships,
  getInternshipLocations,
  getInternshipsById,
  submitPdf,
  updateInternship,
  updateAnswerOnInternship,
  getInternshipEvaluation,
  updateAnswerToPublish,
  getAllInternshipsInCompany,
  updateAgreementOnInternship,
  updateFeedbackOnInternship,
  getInternshipFreeFeedbacks,
} from "../controllers/internship";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Semester } from "../helpers/semesterHelper";
import validator from "validator";
import isBoolean = validator.isBoolean;

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
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  query("seen")
    .toLowerCase()
    .custom((s) => (s ? isBoolean(s) : true)),
  validate,
  asyncHandler(findInternships)
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
  "/internshipsWithEvaluation",
  authMiddleware(),
  query("semester")
    .toUpperCase()
    .optional()
    .custom((s) => Semester.isValidSemesterString(s) || s === ""),
  validate,
  asyncHandler(getInternshipEvaluation)
);

internshipRouter.get(
  "/company/:id",
  authMiddleware(),
  param("id").custom((id) => isObjectId(id)),
  validate,
  asyncHandler(getAllInternshipsInCompany)
);

internshipRouter.get(
  "/freeFeedbacks",
  authMiddleware(),
  param("id").custom((id) => isObjectId(id)),
  validate,
  asyncHandler(getInternshipFreeFeedbacks)
);

internshipRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => isObjectId(id) || id === "my" || id === "random"),
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
    "programmingLanguages", //array
    "paymentTypes", //enum, array
    //supervisor
    "supervisorFullName",
    "supervisorEmailAddress",
    "companyId",
    "evaluationFile",
  ]),
  validate,
  asyncHandler(createInternship)
);

internshipRouter.patch(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
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
    "evaluationFile",
  ]),
  validate,
  asyncHandler(updateInternship)
);

/* PDF endpoints */
internshipRouter.post(
  "/:id/pdf/request",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("requestPdf"))
);

internshipRouter.post(
  "/:id/pdf/lsfEctsProof",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("lsfEctsProofPdf"))
);

internshipRouter.post(
  "/:id/pdf/locationJustification",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("locationJustificationPdf"))
);

internshipRouter.post(
  "/:id/pdf/contract",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("contractPdf"))
);

internshipRouter.post(
  "/:id/pdf/bvgTicketExemption",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("bvgTicketExemptionPdf"))
);

internshipRouter.post(
  "/:id/pdf/certificate",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("certificatePdf"))
);

internshipRouter.post(
  "/:id/pdf/report",
  authMiddleware(),
  param("id").custom((id) => /[0-91-f]{24}/.test(id)),
  body("accept").optional().isBoolean(),
  body("reject").optional().isBoolean(),
  validate,
  asyncHandler(submitPdf("reportPdf"))
);

internshipRouter.patch(
  "/:id/answerToUpdate",
  authMiddleware(),
  param("id").custom(isObjectId),
  query([
    "answerTextContent",
    "id",
  ]),
  validate,
  asyncHandler(updateAnswerOnInternship)
);

internshipRouter.patch(
  "/:id/updateAnswerToPublish",
  authMiddleware(),
  param("id").custom(isObjectId),
  query([
    "questionId",
    "isAnswerReviewed",
    "isAnswerPublished"
  ]),
  validate,
  asyncHandler(updateAnswerToPublish)
);

internshipRouter.patch(
  "/:id/agreementToUpdate",
  authMiddleware(),
  param("id").custom(isObjectId),
  query([
    "showMyProfile",
  ]),
  validate,
  asyncHandler(updateAgreementOnInternship)
);

internshipRouter.patch(
  "/:id/feedbackToUpdate",
  authMiddleware(),
  param("id").custom(isObjectId),
  query([
    "feedbackId",
    "freetextFeedback",
  ]),
  validate,
  asyncHandler(updateFeedbackOnInternship)
);

export default internshipRouter;
