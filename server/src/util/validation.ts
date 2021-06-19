import validator from "validator";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UnprocessableEntityError } from "./errors";

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new UnprocessableEntityError({ errors: errors.array() }));
  return next();
}

export function usernameSanitizer(username: string): string {
  const regexMatches = /(s0[0-9]{6})(@htw-berlin\.de)?/.exec(username);
  return regexMatches ? regexMatches[1] : "";
}

export function studentIdValidator(value: string): boolean {
  return validator.matches(value, /s0[0-9]{6}/);
}
