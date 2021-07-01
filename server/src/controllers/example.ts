import { Request, Response } from "express";
import seed from "../seed";

export async function exampleGet(req: Request, res: Response): Promise<void> {
  res.json(req.user);
}

export async function examplePost(req: Request, res: Response): Promise<void> {
  res.json(req.body);
}

export async function seedDb(req: Request, res: Response): Promise<void> {
  await seed();
  res.json({ msg: "done" });
}
