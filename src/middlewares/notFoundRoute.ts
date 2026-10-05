import { Request, Response, RequestHandler } from "express";

export const notFound = async (req: Request, res: Response): Promise<void> => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    })
}