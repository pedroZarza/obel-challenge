import { HttpError } from "../utils/HttpErrors";
import { Request, Response, NextFunction } from "express";


export async function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
    console.error(err.message/* , err.stack */);
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ status: "error", message: err.message, errors: err.errors });
        return;
    }
    res.status(500).json({ status: "error", message: "Ha ocurrido un error" });
}