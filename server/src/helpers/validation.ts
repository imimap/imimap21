import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UnprocessableEntityError } from "./errors";

export function isObjectId(id: string): boolean {
  return /[0-9a-z]{24}/.test(id);
}

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new UnprocessableEntityError({ errors: errors.array() }));
  return next();
}
