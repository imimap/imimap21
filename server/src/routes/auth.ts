import { Router } from "express";
import { login } from "../controllers/auth";
import * as asyncHandler from "express-async-handler";
import { body } from "express-validator";
import { validate } from "../helpers/validation";
import { isValidStudentId, sanitizeUsername } from "../helpers/studentIdHelper";

const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("username").customSanitizer(sanitizeUsername).custom(isValidStudentId),
    body("password").isString().not().isEmpty(),
  ],
  validate,
  asyncHandler(login)
);

export default authRouter;
