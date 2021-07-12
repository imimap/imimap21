import { Router } from "express";
import exampleRouter from "./example";
import authRouter from "./auth";
import internshipModuleRouter from "./internshipModule";
import internshipRouter from "./internship";
import companyRouter from "./company";
import postponementRequestRouter from "./postponementRequest";

const router = Router();

router.use("/auth", authRouter);

router.use("/x", exampleRouter);

router.use("/internship-modules", internshipModuleRouter);

router.use("/internships", internshipRouter);

router.use("/companies", companyRouter);

router.use("/postponement-requests", postponementRequestRouter);

export default router;
