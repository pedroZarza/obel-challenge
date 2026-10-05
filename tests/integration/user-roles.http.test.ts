import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";
import { API_KEY, clearRoleData, createRole } from "../helpers";

describe("PUT /users/:userId/roles/:roleId", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        clearRoleData();
    });

    it("asigna el rol, lo expone en las dos lecturas y no duplica la fila si se repite", async () => {
        const roleId = await createRole({
            name: "editor",
            description: "Editor de contenido",
            type: "system",
            scope: "content",
        });

        const assigned = await request(app)
            .put(`/users/1/roles/${roleId}`)
            .set("Authorization", API_KEY);

        expect(assigned.status).toBe(201);
        expect(assigned.body).toEqual({
            status: "success",
            message: "Rol asignado correctamente",
        });

        const userRoles = await request(app)
            .get("/users/1/roles")
            .set("Authorization", API_KEY);

        expect(userRoles.status).toBe(200);
        expect(userRoles.body).toEqual({
            status: "success",
            userId: 1,
            roles: [{ role_id: roleId, name: "editor" }],
        });

        const users = await request(app)
            .get("/users")
            .set("Authorization", API_KEY);

        const pedro = users.body.users.find((user: { id: number }) => user.id === 1);
        expect(pedro.roles).toEqual([{ id: roleId, name: "editor" }]);

        const repeated = await request(app)
            .put(`/users/1/roles/${roleId}`)
            .set("Authorization", API_KEY);

        expect(repeated.status).toBe(200);
        expect(repeated.body).toEqual({
            status: "success",
            message: "Rol ya asignado",
        });

        const afterRepeat = await request(app)
            .get("/users/1/roles")
            .set("Authorization", API_KEY);

        expect(afterRepeat.body.roles).toEqual([{ role_id: roleId, name: "editor" }]);
    });

    it("responde 404 si el usuario no existe", async () => {
        const roleId = await createRole({
            name: "editor",
            description: "Editor de contenido",
            type: "system",
            scope: "content",
        });

        const response = await request(app)
            .put(`/users/999/roles/${roleId}`)
            .set("Authorization", API_KEY);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: "error",
            message: "Usuario no encontrado",
        });
    });

    it("responde 404 si el rol no existe", async () => {
        const response = await request(app)
            .put("/users/1/roles/99999")
            .set("Authorization", API_KEY);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: "error",
            message: "Rol no encontrado",
        });
    });
});
