import express from "express";
import morgan from "morgan";

import { initializeDatabase } from "./data/init";

import routesIndex from "./routes/index.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFoundRoute";
import { auth } from "./middlewares/auth";

const app = express();
initializeDatabase();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(auth, routesIndex);
app.use(notFound);
app.use(errorHandler);


export default app;