import { Router } from "express";
import * as asyncHandler from "express-async-handler";
import { testGet, testPost } from "../controllers/test";

const testRouter = Router();

testRouter.get("/profile", asyncHandler(testGet));

testRouter.post("/", asyncHandler(testPost));

export default testRouter;
