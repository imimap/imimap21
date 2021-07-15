// parse env variables before loading anything else
import { config as dotenvConfig } from "dotenv";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { HttpError, NotFound } from "http-errors";
import router from "./routes";
import database from "./database";
import ldapStrategy from "./authentication/ldapStrategy";
import localStrategy from "./authentication/localStrategy";
import * as fileUpload from "express-fileupload";
import authMiddleware, { pdfFileAuthMiddleware } from "./authentication/middleware";

dotenvConfig({ path: "../.env" });

// load database
(async () => await database())();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(passport.initialize());
passport.use(ldapStrategy);
if (process.env.NODE_ENV === "development" && process.env.BYPASS_LDAP) passport.use(localStrategy);

// Defining route middleware
app.use("/api", router);
// Defining static pdf host middleware
app.use("/pdfs", authMiddleware());
app.use("/pdfs", pdfFileAuthMiddleware);
app.use("/pdfs", express.static(`${process.cwd()}/pdfs`));

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFound(`Path "${req.path}" not found`));
});

// Error handler
app.use(function (error: unknown, request: Request, response: Response, next: NextFunction) {
  if (error instanceof HttpError) {
    response.statusCode = error.statusCode;
  } else if (typeof error === "string") {
    error = {
      message: error,
    };
  } else {
    response.statusCode = 500;
  }
  console.log(error);
  response.json({ error });
  return next();
});

// Listening to port
app.listen(port);
console.log(`Listening on http://localhost:${port}/api`);
