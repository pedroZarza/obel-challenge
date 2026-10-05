import {Request, Response, NextFunction } from "express";
import { assignRoleToUser, readAllUsers, readUserRoles, removeRoleFromUser } from "../services/users.service";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await readAllUsers()
        res.status(200).json({
            status: "success",
            users: users
        })
        return;
    } catch (error) {
        next(error)
    }
}

export const getUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.params.userId)  
        const roles = await readUserRoles(userId)
        res.status(200).json({
            status: "success",
            userId: userId,
            roles: roles
        })
        return;
    } catch (error) {
        next(error)
    }
}

export const assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.params.userId)  
        const roleId = Number(req.params.roleId)  
        const result = await assignRoleToUser(userId, roleId)
        const statusCode = result === 1 ? 201 : 200
        res.status(statusCode).json({
            status: "success",
            message: "Rol asignado",
        })
        return;
    } catch (error) {
        next(error)
    }
}

export const removeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number(req.params.userId)  
        const roleId = Number(req.params.roleId)  
        const result = await removeRoleFromUser(userId, roleId)
        res.status(200).json({
            removed: result === 1
        })
        return;
    } catch (error) {
        next(error)
    }
}
