import { StatementResultingChanges } from "node:sqlite";
import { db } from "../data/config/database";
import { Role } from "../interfaces/interfaces";
import { RoleData } from "../schemas/validation.schemas";


export const rolesRepository = {
    findAllRoles: async (): Promise<Role[]> => {
        const roles = db.prepare(`SELECT * FROM roles;`).all() as unknown as Role[]
        return roles;
    },

    findRoleById: async (roleId: number): Promise<Role | undefined> => {
        const role = db.prepare(`SELECT * FROM roles r WHERE r.id == ?;`).get(roleId) as unknown as Role | undefined
        return role;
    },

    findRoleByName: async (name: string): Promise<Role | undefined> => {
        const role = db.prepare(`
        SELECT *
        FROM roles r
        WHERE r.name = ?;`).get(name) as unknown as Role | undefined;
        return role;
    },

    insertNewRole: async (newRole: RoleData): Promise<number> => {
        const insert = db.prepare(`INSERT INTO roles (name, description, type, scope)
        VALUES (?, ?, ?, ?);`).run(newRole.name, newRole.description, newRole.type, newRole.scope);
        return Number(insert.lastInsertRowid);
    },

    updateRoleById: async (roleId: number, updatedRole: RoleData): Promise<number> => {
        const update = db.prepare(`
        UPDATE roles
        SET name = ?, description = ?, type = ?, scope = ?
        WHERE id = ?;`).run(updatedRole.name, updatedRole.description, updatedRole.type, updatedRole.scope, roleId)
        return Number(update.changes) 
    }
}