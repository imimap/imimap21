import { Router } from "express";
import { param, query } from "express-validator";
import { Semester } from "../helpers/semesterHelper";
import authMiddleware from "../authentication/middleware";
import { validate } from "../helpers/validation";
import * as asyncHandler from "express-async-handler";
import { getStudentById, getStudents } from "../controllers/student";

const studentRouter = Router();

studentRouter.get("/", authMiddleware(true), validate, asyncHandler(getStudents));

studentRouter.get(
  "/:id",
  authMiddleware(),
  param("id").custom((id) => /[0-9a-f]{24}/.test(id)),
  validate,
  asyncHandler(getStudentById)
);

export default studentRouter;
