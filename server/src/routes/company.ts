/* The following endpoints can be used to provide options to a search form */

import authMiddleware from "../authentication/middleware";
import { param } from "express-validator";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { Router } from "express";
import { getAllCompanies, getAllCountries, getCities } from "../controllers/company";

const companyRouter = Router();

companyRouter.get("/", authMiddleware(), validate, asyncHandler(getAllCompanies));

companyRouter.get("/cities", authMiddleware(), validate, asyncHandler(getCities));

companyRouter.get(
  "/:country/cities",
  authMiddleware(),
  param("country"),
  validate,
  asyncHandler(getCities)
);

companyRouter.get("/countries", authMiddleware(), validate, asyncHandler(getAllCountries));

export default companyRouter;
