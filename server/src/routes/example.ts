import { Router } from "express";
import * as asyncHandler from "express-async-handler";
import { exampleGet, examplePost, maintain, seedDb, seedDbMin } from "../controllers/example";
import authMiddleware from "../authentication/middleware";
import { param, query } from "express-validator";
import { validate } from "../helpers/validation";


const exampleRouter = Router();

exampleRouter.get("/profile", authMiddleware(true), asyncHandler(exampleGet));

exampleRouter.post("/", asyncHandler(examplePost));

exampleRouter.get("/seed", asyncHandler(seedDb));
exampleRouter.get("/seedUsers", asyncHandler(seedDbMin));

exampleRouter.get(
    "/maintenance/:isOn",
    authMiddleware(true),
    param("isOn").optional().isBoolean(),
    validate,
    asyncHandler(maintain)
  );
export default exampleRouter;
