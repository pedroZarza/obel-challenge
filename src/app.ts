import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { serve, setup } from "swagger-ui-express";

import { initializeDatabase } from "./data/init";
import { openApiSpec } from "./docs/openapi";

import routesIndex from "./routes/index.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFoundRoute";
import { auth } from "./middlewares/auth";

const app = express();
initializeDatabase();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function redirectBareDocs(req: Request, res: Response, next: NextFunction): void {
    const pathOnly = req.originalUrl.split("?")[0];
    if (pathOnly === "/docs") {
        res.redirect("/docs/");
        return;
    }
    next();
}

const SWAGGER_CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5";

app.use(
    "/docs",
    redirectBareDocs,
    serve,
    setup(openApiSpec, {
        customSiteTitle: "Obel Challenge API",
        customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
        customJs: [
            `${SWAGGER_CDN}/swagger-ui-bundle.js`,
            `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
        ],
        swaggerOptions: { persistAuthorization: true },
    }),
);

app.use(auth, routesIndex);
app.use(notFound);
app.use(errorHandler);


export default app;