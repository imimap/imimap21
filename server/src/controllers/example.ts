import { NextFunction, Request, Response } from "express";
import seed from "../seed";
import { Forbidden } from "http-errors";
import { sendEvent } from "./events";
import { boolean, number } from "yargs";

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

const status = {
  type: 'maintenanceInfo',
  maintenanceMode: false,
  maintenanceTimeout: 0 
}
const warningInterval = 10 * 1000;

export async function maintain(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log("maintain");
  if (req.params.isOn != undefined) {
    status.maintenanceMode = req.params.isOn == "true";
    if (status.maintenanceMode) {
      status.maintenanceTimeout = 3 * 60 *1000; // x millisec before maintenance really starts
      let maintInterval = setInterval(() => {
        status.maintenanceTimeout -= warningInterval;
        if (status.maintenanceTimeout <= 0) clearInterval(maintInterval);
        sendEvent(status);
      },warningInterval); // countdown timer until zero
    }
    sendEvent(status);
  }
  res.json(status);
}
