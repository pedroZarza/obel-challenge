import { Request, Response, NextFunction } from "express"
import { ErrorFactory } from "../utils/HttpErrors"

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers["authorization"]
    if (token !== process.env.API_KEY) {
        throw ErrorFactory.createError(401, "Token invalido o inexistente.")
    }
    next()
}