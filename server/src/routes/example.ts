import { Router } from "express";
import * as asyncHandler from "express-async-handler";
import { exampleGet, examplePost, seedDb } from "../controllers/example";
import authMiddleware from "../authentication/middleware";

const exampleRouter = Router();

exampleRouter.get("/profile", authMiddleware(true), asyncHandler(exampleGet));

exampleRouter.post("/", asyncHandler(examplePost));

exampleRouter.get("/seed", asyncHandler(seedDb));

export default exampleRouter;
