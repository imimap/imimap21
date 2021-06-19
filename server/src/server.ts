// parse env variables before loading anything else
import { config as dotenvConfig } from "dotenv";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { HttpError, NotFound } from "http-errors";
import router from "./routes";
import database from "./database";
import ldapStrategy from "./authentication/strategy";

dotenvConfig({ path: "../.env" });

// load database
(async () => await database())();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(ldapStrategy);

// Defining route middleware
app.use("/api", router);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFound());
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
