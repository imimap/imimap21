import { Router } from "express";
import exampleRouter from "./example";
import authRouter from "./auth";
import internshipModuleRouter from "./internshipModule";
import studentRouter from "./student";
import internshipRouter from "./internship";
import companyRouter from "./company";
import postponementRequestRouter from "./postponementRequest";
import infoRouter from "./info";
import questionRouter from "./question";
import evaluationRouter from "./evaluation";

const router = Router();

router.use("/auth", authRouter);

router.use("/x", exampleRouter);

router.use("/internship-modules", internshipModuleRouter);

router.use("/students", studentRouter);

router.use("/internships", internshipRouter);

router.use("/companies", companyRouter);

router.use("/postponement-requests", postponementRequestRouter);

router.use("/info", infoRouter);

router.use("/questions", questionRouter);

router.use("/evaluations", evaluationRouter);

export default router;
