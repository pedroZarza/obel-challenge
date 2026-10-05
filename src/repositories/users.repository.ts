import { db } from "../data/config/database";
import { RoleSummary, User, UserWithRoles, Role } from "../interfaces/interfaces";

export const userRepository = {
    findUserById: async (userId: number): Promise<User | undefined> => {
        const user = db.prepare(`SELECT * FROM users u WHERE u.id = ?;`).get(userId) as unknown as User | undefined
        return user
    },

    findAllUsersWithRoles: async (): Promise<UserWithRoles[]> => {
        const users = db.prepare(`
        SELECT *
        FROM users u
        ORDER BY u.id;
        `).all() as unknown as UserWithRoles[]
        for (const user of users) {
            const assignments = db.prepare(`
            SELECT 
            r.id,
            r.name
            FROM user_roles ur
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id == ?;`).all(user.id) as RoleSummary[]
            user.roles = assignments
        }
        return users;
    },

    findAllUserRoles: async (userId: number): Promise<Role[]> => {
        const userRoles = db.prepare(`
            SELECT 
            ur.role_id,
            r.name
            FROM user_roles ur
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id == ?;`).all(userId) as unknown as Role[]
        return userRoles;
    },

    addRoleToUser: async (userId: number, roleId: number): Promise<number> => {
        const assignment = db.prepare(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES (?, ?)
            ON CONFLICT(user_id, role_id) DO NOTHING;`).run(userId, roleId);
        return Number(assignment.changes);
    },

    removeUserRole: async (userId: number, roleId: number): Promise<number> => {
        const result = db.prepare(`DELETE FROM user_roles AS ur
            WHERE ur.user_id == ? AND ur.role_id == ?;`).run(userId, roleId)
        return Number(result.changes);
    }
}