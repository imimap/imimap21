import { NextFunction, Request, Response } from "express";
import seed from "../seed";
import { Forbidden } from "http-errors";

export async function exampleGet(req: Request, res: Response): Promise<void> {
  res.json(req.user);
}

export async function examplePost(req: Request, res: Response): Promise<void> {
  res.json(req.body);
}

export async function seedDb(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (process.env.NODE_ENV !== "development")
    return next(new Forbidden("Only allowed in development environment"));
  await seed(false);
  res.json({ msg: "done" });
}

export async function seedDbMin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (process.env.NODE_ENV !== "development")
    return next(new Forbidden("Only allowed in development environment"));
  await seed(true);
  res.json({ msg: "done" });
}
