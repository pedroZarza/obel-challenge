import { Request, Response, NextFunction } from "express";
import { createNewRole, readAllRoles, readRoleById, updateRoleById } from "../services/roles.service";

export const getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const roles = await readAllRoles()
        res.status(200).json({
            status: "success",
            roles: roles
        })
        return;
    } catch (error) {
        next(error)
    }
}

export const getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const roleId = Number(req.params.roleId)
        const role = await readRoleById(roleId)
        res.status(200).json({
            status: "success",
            role: role
        })
        return;
    } catch (error) {
        next(error)
    }
}

export const createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { body } = req
        const createdId = await createNewRole(body)
        res.status(201).json({
            status: "success",
            message: "created",
            id: createdId,
            roleData: body
        })
        return;

    } catch (error) {
        next(error)
    }
}

export const editRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { body } = req
        const roleId = Number(req.params.roleId)
        const updated = await updateRoleById(roleId, body)
        res.status(200).json({
            status: "success",
            message: updated === 1 ? "updated" : "no changes",
            id: roleId,
            roleData: body
        })
        return;
    } catch (error) {
        next(error)
    }
}

