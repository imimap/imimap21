import { Router } from "express";
import { query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import {
  getMyInternshipModule,
  listAll,
  listPostponementRequests,
} from "../controllers/internshipModule";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";

const internshipModuleRouter = Router();

internshipModuleRouter.get(
  "/",
  authMiddleware,
  query("semester")
    .toUpperCase()
    .custom((s) => Semester.isValidSemesterString(s) || !s),
  validate,
  asyncHandler(listAll)
);

internshipModuleRouter.get("/my", authMiddleware, asyncHandler(getMyInternshipModule));

internshipModuleRouter.get(
  "/postponements",
  authMiddleware,
  asyncHandler(listPostponementRequests)
);

export default internshipModuleRouter;
