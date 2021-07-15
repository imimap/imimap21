import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
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

companyRouter.post(
  "/",
  authMiddleware(),
  query([
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
  ]),
  validate,
  asyncHandler(createCompany)
);

companyRouter.patch(
  "/:id",
  authMiddleware(true),
  param("id").custom(isObjectId),
  query([
    //company
    "companyName",
    "branchName",
    "emailAddress",
    "industry",
    "website",
    "mainLanguage",
    "size",
    //address
    "street",
    "streetNumber",
    "additionalLines",
    "zip",
    "city",
    "country",
  ]),
  validate,
  asyncHandler(updateCompany)
);

export default companyRouter;
