import { Router } from "express";
import exampleRouter from "./example";
import authRouter from "./auth";

const router = Router();

router.use("/auth", authRouter);

router.use("/x", exampleRouter);

export default router;
