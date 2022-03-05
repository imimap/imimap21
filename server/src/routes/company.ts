import authMiddleware from "../authentication/middleware";
import { body, param, query } from "express-validator";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company";

const companyRouter = Router();

companyRouter.get(
  "/",
  authMiddleware(),
  query("companyName", "branchName"),
  validate,
  asyncHandler(getAllCompanies)
);

companyRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(getCompanyById)
);

const standardPostParams = [
  //company
  "companyName",
  "branchName",
  "emailAddress",
  "industry",
  "website",
  "mainLanguage", //enum
  "size", //enum
  //address
  "street",
  "streetNumber",
  "additionalLines",
  "zip",
  "city",
  "country",
];

companyRouter.post(
  "/",
  authMiddleware(),
  body(standardPostParams),
  validate,
  asyncHandler(createCompany)
);

companyRouter.patch(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  body(standardPostParams),
  validate,
  asyncHandler(updateCompany)
);

export default companyRouter;
