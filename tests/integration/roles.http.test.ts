import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";
import { API_KEY, clearRoleData, createRole } from "../helpers";

describe("PATCH /roles/:roleId", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        clearRoleData();
    });

    it("persiste una modificación parcial (descripción) y conserva el resto del rol", async () => {
        const roleId = await createRole({
            name: "editor",
            description: "Editor de contenido",
            type: "system",
            scope: "content",
        });

        const patch = await request(app)
            .patch(`/roles/${roleId}`)
            .set("Authorization", API_KEY)
            .send({ description: "Nueva descripción" });

        expect(patch.status).toBe(200);
        expect(patch.body).toEqual({
            status: "success",
            message: "updated",
            id: roleId,
            roleData: { description: "Nueva descripción" },
        });

        const stored = await request(app)
            .get(`/roles/${roleId}`)
            .set("Authorization", API_KEY);

        expect(stored.status).toBe(200);
        expect(stored.body.role).toEqual({
            id: roleId,
            name: "editor",
            description: "Nueva descripción",
            type: "system",
            scope: "content",
        });
    });

    it("responde 409 y no cambia el nombre si ya pertenece a otro rol", async () => {
        await createRole({
            name: "admin",
            description: "Administrador",
            type: "system",
            scope: "global",
        });
        const editorId = await createRole({
            name: "editor",
            description: "Editor de contenido",
            type: "system",
            scope: "content",
        });

        const patch = await request(app)
            .patch(`/roles/${editorId}`)
            .set("Authorization", API_KEY)
            .send({ name: "admin" });

        expect(patch.status).toBe(409);
        expect(patch.body).toEqual({
            status: "error",
            message: "Ya existe un rol con nombre 'admin'",
        });

        const stored = await request(app)
            .get(`/roles/${editorId}`)
            .set("Authorization", API_KEY);

        expect(stored.body.role.name).toBe("editor");
    });

    it("responde 400 y no modifica el rol si la descripción supera los 50 caracteres", async () => {
        const roleId = await createRole({
            name: "editor",
            description: "Editor de contenido",
            type: "system",
            scope: "content",
        });

        const patch = await request(app)
            .patch(`/roles/${roleId}`)
            .set("Authorization", API_KEY)
            .send({ description: "a".repeat(51) });

        expect(patch.status).toBe(400);
        expect(patch.body).toEqual({
            status: "error",
            message: "Bad Request",
            errors: [{ field: "description", message: "Máx. 50 caracteres" }],
        });

        const stored = await request(app)
            .get(`/roles/${roleId}`)
            .set("Authorization", API_KEY);

        expect(stored.body.role.description).toBe("Editor de contenido");
    });
});
