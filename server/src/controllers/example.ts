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

export let maintenanceMode: boolean = false;
export let maintenanceTimeout: number = 0;

export async function maintain(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log("maintain");
  if (req.params.isOn != undefined) {
    maintenanceMode = req.params.isOn == "true";
    if (maintenanceMode) {
      maintenanceTimeout = 3; // x Minutes before maintenance really starts
      let maintInterval = setInterval(() => {
        maintenanceTimeout--;
        if (maintenanceTimeout == 0) clearInterval(maintInterval);
      }, 60 * 1000); // every minute countdown timer until zero
    }
  }
  res.json({ maintenanceMode, maintenanceTimeout });
}
