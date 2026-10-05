export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Obel Challenge — Roles y asignaciones",
        version: "1.0.0",
        description:
            "API para crear roles y asignarlos a usuarios. Todas las operaciones piden el header `Authorization` con el valor de `API_KEY`, sin prefijo `Bearer`.",
    },
    tags: [
        { name: "Roles", description: "Alta, lectura y edición de roles" },
        { name: "Users", description: "Usuarios precargados y sus asignaciones" },
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "API_KEY. No utilizar el prefijo Bearer.",
            },
        },
        parameters: {
            UserId: {
                name: "userId",
                in: "path",
                required: true,
                schema: { type: "integer" },
            },
            RoleId: {
                name: "roleId",
                in: "path",
                required: true,
                schema: { type: "integer" },
            },
        },
        schemas: {
            RoleType: {
                type: "string",
                enum: ["system", "custom"],
                nullable: true,
            },
            RoleScope: {
                type: "string",
                enum: ["global", "users", "content", "reports"],
                nullable: true,
            },
            Role: {
                type: "object",
                required: ["id", "name", "description", "type", "scope"],
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    description: { type: "string", nullable: true, maxLength: 50 },
                    type: { $ref: "#/components/schemas/RoleType" },
                    scope: { $ref: "#/components/schemas/RoleScope" },
                },
            },
            RoleWrite: {
                type: "object",
                required: ["name"],
                additionalProperties: false,
                properties: {
                    name: {
                        type: "string",
                        minLength: 1,
                        description: "Obligatorio. Se recortan los espacios; no puede quedar vacío.",
                    },
                    description: { type: "string", nullable: true, maxLength: 50 },
                    type: { $ref: "#/components/schemas/RoleType" },
                    scope: { $ref: "#/components/schemas/RoleScope" },
                },
            },
            RolePatch: {
                type: "object",
                additionalProperties: false,
                properties: {
                    name: { type: "string", minLength: 1 },
                    description: { type: "string", nullable: true, maxLength: 50 },
                    type: { $ref: "#/components/schemas/RoleType" },
                    scope: { $ref: "#/components/schemas/RoleScope" },
                },
            },
            RoleSummary: {
                type: "object",
                required: ["id", "name"],
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                },
            },
            UserRoleAssignment: {
                type: "object",
                required: ["role_id", "name"],
                properties: {
                    role_id: { type: "integer" },
                    name: { type: "string" },
                },
            },
            User: {
                type: "object",
                required: ["id", "username", "roles"],
                properties: {
                    id: { type: "integer" },
                    username: { type: "string" },
                    roles: {
                        type: "array",
                        items: { $ref: "#/components/schemas/RoleSummary" },
                    },
                },
            },
            AssignmentResult: {
                type: "object",
                required: ["status", "message"],
                properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string" },
                },
            },
            Error: {
                type: "object",
                required: ["status", "message"],
                properties: {
                    status: { type: "string", example: "error" },
                    message: { type: "string" },
                    errors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                field: { type: "string" },
                                message: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            Unauthorized: {
                description: "Falta el header Authorization o no coincide con API_KEY",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        example: { status: "error", message: "Token invalido o inexistente." },
                    },
                },
            },
            BadRequest: {
                description: "El cuerpo no cumple el esquema",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Error" },
                        example: {
                            status: "error",
                            message: "Bad Request",
                            errors: [{ field: "name", message: "El nombre del rol es obligatorio" }],
                        },
                    },
                },
            },
        },
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
        "/roles": {
            get: {
                tags: ["Roles"],
                summary: "Listar roles",
                responses: {
                    "200": {
                        description: "Listado de roles",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "roles"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        roles: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Role" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                },
            },
            post: {
                tags: ["Roles"],
                summary: "Crear un rol",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RoleWrite" },
                            example: {
                                name: "editor",
                                description: "Editor de contenido",
                                type: "system",
                                scope: "content",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Rol creado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "message", "id", "roleData"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        message: { type: "string", example: "created" },
                                        id: { type: "integer" },
                                        roleData: { $ref: "#/components/schemas/RoleWrite" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "409": {
                        description: "Ya existe un rol con ese nombre",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: "error",
                                    message: "El rol con el nombre 'editor' ya existe",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/roles/{roleId}": {
            get: {
                tags: ["Roles"],
                summary: "Obtener un rol por ID",
                parameters: [{ $ref: "#/components/parameters/RoleId" }],
                responses: {
                    "200": {
                        description: "Rol encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "role"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        role: { $ref: "#/components/schemas/Role" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "404": {
                        description: "El rol no existe",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: { status: "error", message: "Rol no encontrado" },
                            },
                        },
                    },
                },
            },
            patch: {
                tags: ["Roles"],
                summary: "Editar un rol",
                parameters: [{ $ref: "#/components/parameters/RoleId" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RolePatch" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Rol actualizado, o el cuerpo no cambió ninguna columna",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "message", "id", "roleData"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        message: { type: "string", enum: ["updated", "no changes"] },
                                        id: { type: "integer" },
                                        roleData: { $ref: "#/components/schemas/RolePatch" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "404": {
                        description: "El rol no existe",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: { status: "error", message: "Rol no encontrado" },
                            },
                        },
                    },
                    "409": {
                        description: "El nombre nuevo ya pertenece a otro rol",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: "error",
                                    message: "Ya existe un rol con nombre 'admin'",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Listar usuarios con sus roles",
                responses: {
                    "200": {
                        description: "Usuarios precargados y un resumen de cada rol asignado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "users"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        users: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/User" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                },
            },
        },
        "/users/{userId}/roles": {
            get: {
                tags: ["Users"],
                summary: "Listar los roles de un usuario",
                parameters: [{ $ref: "#/components/parameters/UserId" }],
                responses: {
                    "200": {
                        description: "Asignaciones del usuario",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "userId", "roles"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        userId: { type: "integer" },
                                        roles: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/UserRoleAssignment" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "404": {
                        description: "El usuario no existe",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: { status: "error", message: "Usuario no encontrado" },
                            },
                        },
                    },
                },
            },
        },
        "/users/{userId}/roles/{roleId}": {
            put: {
                tags: ["Users"],
                summary: "Asignar un rol a un usuario",
                parameters: [
                    { $ref: "#/components/parameters/UserId" },
                    { $ref: "#/components/parameters/RoleId" },
                ],
                responses: {
                    "201": {
                        description: "Asignación creada",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AssignmentResult" },
                                example: { status: "success", message: "Rol asignado correctamente" },
                            },
                        },
                    },
                    "200": {
                        description: "El usuario ya tenía ese rol",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AssignmentResult" },
                                example: { status: "success", message: "Rol ya asignado" },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "404": {
                        description: "El usuario o el rol no existen",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                examples: {
                                    user: {
                                        value: { status: "error", message: "Usuario no encontrado" },
                                    },
                                    role: {
                                        value: { status: "error", message: "Rol no encontrado" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Users"],
                summary: "Quitar la asignación de un rol",
                parameters: [
                    { $ref: "#/components/parameters/UserId" },
                    { $ref: "#/components/parameters/RoleId" },
                ],
                responses: {
                    "200": {
                        description: "La asignación se eliminó, o no existía",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["status", "removed"],
                                    properties: {
                                        status: { type: "string", example: "success" },
                                        removed: {
                                            type: "boolean",
                                            description: "true si había una fila y se borró",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "404": {
                        description: "El usuario o el rol no existen",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },
    },
};
