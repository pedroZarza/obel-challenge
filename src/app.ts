import express from "express";
import morgan from "morgan";

import { initializeDatabase } from "./data/init.js";

import routesIndex from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFoundRoute.js";
import { auth } from "./middlewares/auth.js";

const app = express();
initializeDatabase();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(auth, routesIndex);
app.use(notFound);
app.use(errorHandler);


export default app;