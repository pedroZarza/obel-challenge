import { z } from "zod";

export const roleTypeSchema = z.enum(["system", "custom"]);

export const roleScopeSchema = z.enum([
    "global",
    "users",
    "content",
    "reports",
]);

export const createRoleSchema = z.object({
    name: z.string().trim().min(1, "El nombre del rol es obligatorio"),
    description: z.string().trim().min(1, "Debe escribir una descripción").max(50, "Máx. 50 caracteres").nullable().optional().default(null),
    type: roleTypeSchema.nullable().optional().default(null),
    scope: roleScopeSchema.nullable().optional().default(null),
}).strict();


export const updateRoleSchema = z.object({
    name: z.string().trim().min(1, "El nombre del rol es obligatorio").optional(),
    description: z.string().trim().min(1, "Debe escribir una descripción").max(50, "Máx. 50 caracteres").nullable().optional(),
    type: roleTypeSchema.nullable().optional(),
    scope: roleScopeSchema.nullable().optional(),
}).strict();

export type RoleData = z.infer<typeof createRoleSchema>;
export type UpdatedRoleFields = z.infer<typeof updateRoleSchema>;