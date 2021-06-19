import { Router } from "express";
import { login } from "../controllers/auth";
import * as asyncHandler from "express-async-handler";
import { body } from "express-validator";
import { studentIdValidator, usernameSanitizer, validate } from "../util/validation";

const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("username").customSanitizer(usernameSanitizer).custom(studentIdValidator),
    body("password").isString().not().isEmpty(),
  ],
  validate,
  asyncHandler(login)
);

export default authRouter;
