
export interface User {
    id: number;
    username: string;
}


export interface Role {
    id: number;
    name: string;
    description: string | null;
    type: string | null;
    scope: string | null;
}

export type RoleSummary = Pick<Role, "id" | "name">;

export interface UserWithRoles extends User {
    roles: RoleSummary[]
}

export interface UserRole {
    user_id: number;
    role_id: number;
}



