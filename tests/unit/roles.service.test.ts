import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../src/interfaces/interfaces";

vi.mock("../../src/repositories/roles.repository", () => ({
    rolesRepository: {
        findRoleById: vi.fn(),
        findRoleByName: vi.fn(),
        updateRoleById: vi.fn(),
    },
}));

import { updateRoleById } from "../../src/services/roles.service";
import { rolesRepository } from "../../src/repositories/roles.repository";

const repo = vi.mocked(rolesRepository);

const existingRole: Role = {
    id: 1,
    name: "editor",
    description: "Editor de contenido",
    type: "system",
    scope: "content",
};

describe("updateRoleById", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("lanza 404 y no actualiza si el rol no existe", async () => {
        repo.findRoleById.mockResolvedValue(undefined);

        await expect(updateRoleById(99, { name: "admin" })).rejects.toMatchObject({
            statusCode: 404,
            message: "Rol no encontrado",
        });

        expect(repo.findRoleByName).not.toHaveBeenCalled();
        expect(repo.updateRoleById).not.toHaveBeenCalled();
    });

    it("lanza 409 si el nombre pertenece a otro rol", async () => {
        repo.findRoleById.mockResolvedValue(existingRole);
        repo.findRoleByName.mockResolvedValue({
            ...existingRole,
            id: 2,
            name: "admin",
        });

        await expect(updateRoleById(1, { name: "admin" })).rejects.toMatchObject({
            statusCode: 409,
            message: "Ya existe un rol con nombre 'admin'",
        });

        expect(repo.updateRoleById).not.toHaveBeenCalled();
    });

    it("actualiza cuando el nombre encontrado es el del mismo rol", async () => {
        repo.findRoleById.mockResolvedValue(existingRole);
        repo.findRoleByName.mockResolvedValue(existingRole);
        repo.updateRoleById.mockResolvedValue(1);

        const changes = await updateRoleById(1, { name: "editor", description: "Nueva descripción" }); //service

        expect(changes).toBe(1);
        expect(repo.updateRoleById).toHaveBeenCalledWith(1, {
            ...existingRole,
            name: "editor",
            description: "Nueva descripción",
        });
    });

    it("actualiza cuando el nombre nuevo no está usado", async () => {
        repo.findRoleById.mockResolvedValue(existingRole);
        repo.findRoleByName.mockResolvedValue(undefined);
        repo.updateRoleById.mockResolvedValue(1);

        const changes = await updateRoleById(1, { name: "admin" });

        expect(changes).toBe(1);
        expect(repo.updateRoleById).toHaveBeenCalledWith(1, {
            ...existingRole,
            name: "admin",
        });
    });

    it("fusiona los campos parciales a editar y no consulta el nombre si no viene", async () => {
        repo.findRoleById.mockResolvedValue(existingRole);
        repo.updateRoleById.mockResolvedValue(1);

        const changes = await updateRoleById(1, { description: "Nueva descripción" });

        expect(changes).toBe(1);
        expect(repo.findRoleByName).not.toHaveBeenCalled();
        expect(repo.updateRoleById).toHaveBeenCalledWith(1, {
            ...existingRole,
            description: "Nueva descripción",
        });
    });
});
