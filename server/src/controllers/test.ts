import { Request, Response } from "express";

export async function testGet(req: Request, res: Response): Promise<void> {
  res.json(req.user);
}

export async function testPost(req: Request, res: Response): Promise<void> {
  res.json(req.body);
}
