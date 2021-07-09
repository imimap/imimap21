import { Router } from "express";
import { param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import { findInternships, getInternshipsById } from "../controllers/internship";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const internshipRouter = Router();

internshipRouter.get(
  "/",
  authMiddleware(true),
  query([
    "companyName",
    "branchName",
    "country",
    "industry",
    "mainLanguage",
    "size",
    "programmingLanguage",
    "operationalArea",
    "paymentType",
  ]).toUpperCase(),
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

export default internshipRouter;
