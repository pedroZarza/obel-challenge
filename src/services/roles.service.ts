import { rolesRepository } from "../repositories/roles.repository"
import { Role } from "../interfaces/interfaces"
import { ErrorFactory } from "../utils/HttpErrors"
import { RoleData, UpdatedRoleFields } from "../schemas/validation.schemas";


export async function readAllRoles(): Promise<Role[]> {
    const users = await rolesRepository.findAllRoles()
    return users;
}

export async function readRoleById(roleId: number): Promise<Role> {
    const role = await rolesRepository.findRoleById(roleId)
    if (!role) throw ErrorFactory.createError(404, "Rol no encontrado")
    return role;
}

export async function createNewRole(newRoleData: RoleData): Promise<number> {
    const roleNameUsed = await rolesRepository.findRoleByName(newRoleData.name);
    if (roleNameUsed) throw ErrorFactory.createError(409, `El rol con el nombre '${newRoleData.name}' ya existe`)
    return await rolesRepository.insertNewRole(newRoleData);
}

export async function updateRoleById(roleId: number, updatedRoleData: UpdatedRoleFields): Promise<number> {
    const role = await rolesRepository.findRoleById(roleId)
    if (!role) throw ErrorFactory.createError(404, "Rol no encontrado")
    if(updatedRoleData.name) {
        const roleNameUsed = await rolesRepository.findRoleByName(updatedRoleData.name);
        if (roleNameUsed && roleNameUsed.id !== roleId) throw ErrorFactory.createError(409, `Ya existe un rol con nombre '${updatedRoleData.name}'`)
    }
    const updatedRole = {
        ...role,
        ...updatedRoleData
    } as RoleData
    return await rolesRepository.updateRoleById(roleId, updatedRole)
}
