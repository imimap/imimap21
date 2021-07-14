/* The following endpoints can be used to provide options to a search form */

import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getAllCountries,
  getCities,
  getCompanyById,
} from "../controllers/company";

const companyRouter = Router();

companyRouter.get("/", authMiddleware(true), validate, asyncHandler(getAllCompanies));

companyRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(getCompanyById)
);

companyRouter.get("/cities", authMiddleware(), validate, asyncHandler(getCities));

companyRouter.get(
  "/:country/cities",
  authMiddleware(),
  param("country"),
  validate,
  asyncHandler(getCities)
);

companyRouter.get("/countries", authMiddleware(), validate, asyncHandler(getAllCountries));

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

export default companyRouter;
