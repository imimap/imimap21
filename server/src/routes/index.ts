import { Router } from "express";
import exampleRouter from "./example";
import authRouter from "./auth";
import internshipModuleRouter from "./internshipModule";

const router = Router();

router.use("/auth", authRouter);

router.use("/x", exampleRouter);

router.use("/internship-module", internshipModuleRouter);

export default router;
