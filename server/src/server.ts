import * as cors from "cors";
import * as express from "express";
import { config as dotenvConfig } from "dotenv";
import router from "./router";
import database from "./database";

// parse env variables
dotenvConfig();

// load database
(async () => await database())();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());

// Defining route middleware
app.use("/api", router);

// Listening to port
app.listen(port);
console.log(`Listening on http://localhost:${port}/api`);
