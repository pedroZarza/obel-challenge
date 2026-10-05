import request from "supertest";
import app from "../src/app";
import { db } from "../src/data/config/database";

export const API_KEY = "test-key";

export function clearRoleData(): void {
    db.exec(`
        DELETE FROM user_roles;
        DELETE FROM roles;
    `);
}

export async function createRole(role: {
    name: string;
    description: string;
    type: "system" | "custom";
    scope: "global" | "users" | "content" | "reports";
}): Promise<number> {
    const response = await request(app)
        .post("/roles")
        .set("Authorization", API_KEY)
        .send(role);

    if (response.status !== 201) {
        throw new Error(`No se pudo crear el rol: ${response.status} ${JSON.stringify(response.body)}`);
    }

    return response.body.id as number;
}
