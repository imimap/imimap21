import { Router } from "express";
import { param, query } from "express-validator";
import authMiddleware from "../authentication/middleware";
import {
  getAllOperationalAreas,
  getAllPaymentTypes,
  getAllProgrammingLanguages,
  getAllInternshipStatuses,
} from "../controllers/internship";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { getAllCountries, getCities } from "../controllers/company";
import { getCurrentSemester, getLanguages, getSemesters, getUpcomingSemesters } from "../controllers/info";
import { eventsHandler } from "../controllers/events";

const infoRouter = Router();

/* The following endpoints can be used to provide options to a search form */

infoRouter.get("/payment-types", authMiddleware(), validate, asyncHandler(getAllPaymentTypes));

infoRouter.get(
  "/internship-statuses",
  authMiddleware(),
  validate,
  asyncHandler(getAllInternshipStatuses)
);

infoRouter.get(
  "/operational-areas",
  authMiddleware(),
  validate,
  asyncHandler(getAllOperationalAreas)
);

infoRouter.get(
  "/programming-languages",
  authMiddleware(),
  validate,
  asyncHandler(getAllProgrammingLanguages)
);

infoRouter.get("/cities", authMiddleware(), validate, asyncHandler(getCities));

infoRouter.get(
  "/:country/cities",
  authMiddleware(),
  param("country"),
  validate,
  asyncHandler(getCities)
);

infoRouter.get("/countries", authMiddleware(), validate, asyncHandler(getAllCountries));

infoRouter.get("/semesters", getSemesters);

infoRouter.get("/semesters/current", getCurrentSemester);

infoRouter.get(
  "/semesters/upcoming",
  query("count").default(3).isInt(),
  validate,
  getUpcomingSemesters
);

infoRouter.get("/languages", getLanguages);

infoRouter.get("/events/:email",   param("email"), eventsHandler);

export default infoRouter;
