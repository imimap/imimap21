import authMiddleware from "../authentication/middleware";
import { body, param, query } from "express-validator";
import { isObjectId, validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  findCompaniesSeenAmount,
  findNewCompaniesAmount,
  getCompanyById,
  updateCompany,
  findInternshipsOfSeenCompanies,
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
companyRouter.get(
  "/possibleResults/amount",
  authMiddleware(),
  query(standardQueryParams).toUpperCase(),
  validate,
  asyncHandler(findNewCompaniesAmount)
);

companyRouter.get(
  "/seen/amount",
  authMiddleware(),
  validate,
  asyncHandler(findCompaniesSeenAmount)
);

companyRouter.get(
  "/seen/results",
  authMiddleware(),
  validate,
  asyncHandler(findInternshipsOfSeenCompanies)
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
  authMiddleware(false),
  param("id").custom(isObjectId),
  body(standardPostParams),
  validate,
  asyncHandler(updateCompany)
);

companyRouter.delete(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  validate,
  asyncHandler(deleteCompany)
);

export default companyRouter;
