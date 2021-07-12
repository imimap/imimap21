import { Router } from "express";
import { param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  findInternships,
  findInternshipsInSemester,
  getAllOperationalAreas,
  getAllPaymentTypes,
  getAllProgrammingLanguages,
  getInternshipsById,
} from "../controllers/internship";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const internshipRouter = Router();

internshipRouter.get(
  "/",
  authMiddleware(true),
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
  validate,
  asyncHandler(findInternships)
);

internshipRouter.get(
  "/",
  authMiddleware(true),
  query(["semester"]).toUpperCase(),
  validate,
  asyncHandler(findInternshipsInSemester)
);

internshipRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(getInternshipsById)
);

/* The following endpoints can be used to provide options to a search form */

internshipRouter.get(
  "/payment-types",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(getAllPaymentTypes)
);

internshipRouter.get(
  "/operational-areas",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(getAllOperationalAreas)
);

internshipRouter.get(
  "/programming-languages",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id) || id === "my"),
  validate,
  asyncHandler(getAllProgrammingLanguages)
);

export default internshipRouter;
