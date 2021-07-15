import { Router } from "express";
import { editProfile, login, profile } from "../controllers/auth";
import * as asyncHandler from "express-async-handler";
import { body } from "express-validator";
import { validate } from "../helpers/validation";
import { sanitizeUsername } from "../helpers/studentIdHelper";
import authMiddleware from "../authentication/middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("username").customSanitizer(sanitizeUsername).isString().not().isEmpty(),
    body("password").isString().not().isEmpty(),
  ],
  validate,
  asyncHandler(login)
);

authRouter.get("/profile", authMiddleware(), asyncHandler(profile));

authRouter.patch(
  "/profile",
  authMiddleware(),
  body(["firstName", "lastName"]).optional().isString(),
  validate,
  asyncHandler(editProfile)
);

export default authRouter;
