import { z } from "zod";
import { ErrorFactory } from "../utils/HttpErrors";
import { NextFunction, Request, Response } from "express";

export const validator = (schema: z.ZodType) => async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body } = req;
    const validated = await schema.parseAsync(body).catch((err) => {
        const validationErrors = err.issues.map((error: any) => ({
            field: error.path[0],
            message: error.message
        }))
        throw ErrorFactory.createError(400, "Bad Request", validationErrors);
    })
    req.body = validated;
    next();
}