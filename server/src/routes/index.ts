import { Router } from "express";
import authMiddleware from "../authentication/middleware";
import testRouter from "./test";
import authRouter from "./auth";

const router = Router();

router.use("/auth", authRouter);

router.use("/test", authMiddleware, testRouter);

export default router;
