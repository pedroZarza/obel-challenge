import { userRepository } from "../repositories/users.repository"
import { UserWithRoles, Role } from "../interfaces/interfaces"
import { ErrorFactory } from "../utils/HttpErrors"
import { rolesRepository } from "../repositories/roles.repository";


export async function readAllUsers(): Promise<UserWithRoles[]> {
    const users = await userRepository.findAllUsersWithRoles()
    return users;
}

export async function readUserRoles(userId: number): Promise<Role[]> {
    const user = await userRepository.findUserById(userId)
    if (!user) throw ErrorFactory.createError(404, "Usuario no encontrado")
    const roles = await userRepository.findAllUserRoles(userId)
    return roles;
}

export async function assignRoleToUser(userId: number, roleId: number): Promise<number> {
    const user = await userRepository.findUserById(userId)
    if (!user) throw ErrorFactory.createError(404, "Usuario no encontrado")
    const role = await rolesRepository.findRoleById(roleId)
    if (!role) throw ErrorFactory.createError(404, "Rol no encontrado")
    return await userRepository.addRoleToUser(userId, roleId);
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<number> {
    const user = await userRepository.findUserById(userId)
    if (!user) throw ErrorFactory.createError(404, "Usuario no encontrado")
    const role = await rolesRepository.findRoleById(roleId)
    if (!role) throw ErrorFactory.createError(404, "Rol no encontrado")
    return await userRepository.removeUserRole(userId, roleId);
}