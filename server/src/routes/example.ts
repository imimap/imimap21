import { Router } from "express";
import * as asyncHandler from "express-async-handler";
import { exampleGet, examplePost, seedDb } from "../controllers/example";

const exampleRouter = Router();

exampleRouter.get("/profile", asyncHandler(exampleGet));

exampleRouter.post("/", asyncHandler(examplePost));

exampleRouter.get("/seed", asyncHandler(seedDb));

export default exampleRouter;
