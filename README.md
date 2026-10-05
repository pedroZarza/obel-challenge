# Obel Challenge — API Roles & User Assignments

API REST para gestionar roles y asignarlos a usuarios.

- **Runtime:** Node.js 22+ (usa `node:sqlite`)
- **Stack:** Express 5, TypeScript, Zod, SQLite in-memory
- **Repositorio:** [GitHub](https://github.com/pedroZarza/obel-challenge)

## Requisitos

- [Node.js 22](https://nodejs.org/) o superior
- npm

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3030
API_KEY=tu-api-key
```


| Variable  | Obligatorio | Default | Descripción                                                                 |
| --------- | ----------- | ------- | --------------------------------------------------------------------------- |
| `PORT`    | No          | `3000`  | Puerto HTTP                                                                 |
| `API_KEY` | Sí          | —       | Token que debe enviarse en el header `Authorization` (sin prefijo `Bearer`) |




## Cómo correrlo

Instalar las dependencias:

```bash
npm install
```



### Desarrollo

```bash
npm run dev
```

Con el `.env` del ejemplo, el servidor queda disponible en `http://localhost:3030`. Si no se define `PORT`, utiliza el puerto `3000`.

### Compilación y ejecución

Compilar y ejecutar el proyecto TypeScript:

```bash
npm run build
npm start
```

El código compilado se genera en la carpeta `dist`.

La base SQLite funciona **en memoria**: al reiniciar el proceso se pierden los cambios y se vuelven a precargar los usuarios. Los roles y las asignaciones arrancan vacíos.

Para conservar los datos entre reinicios, modificar `src/data/config/database.ts` y reemplazar:

```ts
export const db = new DatabaseSync(":memory:");
```

por:

```ts
export const db = new DatabaseSync("database.sqlite");
```



## Tests

```bash
npm test
```

Vitest corre los tests unitarios de `roles.service` y los tests HTTP de integración de `/roles` y `/users`. No hace falta levantar el servidor: los tests de integración usan la app de Express directamente. La `API_KEY` de test (`test-key`) la define `vitest.config.mts`.

## Autenticación

Todas las rutas de `/roles` y `/users` requieren el header `Authorization` con el valor definido en `API_KEY`, sin prefijo `Bearer`.

```http
Authorization: tu-api-key
```



## Datos iniciales

Al iniciar la aplicación se precargan únicamente estos usuarios:


| id  | username |
| --- | -------- |
| 1   | Pedro    |
| 2   | Alberto  |
| 3   | Ana      |
| 4   | Juan     |
| 5   | Lucía    |


Los roles se crean mediante `POST /roles` y se asignan mediante `PUT /users/:userId/roles/:roleId`.

## Roles y validaciones

Al crear un rol, `name` es obligatorio y no puede estar vacío ni contener únicamente espacios. Los campos `description`, `type` y `scope` son opcionales.

Los valores de `type` y `scope` fueron definidos para este challenge. Son metadatos ficticios validados mediante enumeraciones; no controlan el acceso a endpoints.

### `type`

Clasifica el origen del rol.


| Valor    | Significado                                                       |
| -------- | ----------------------------------------------------------------- |
| `system` | Rol propio de la plataforma, por ejemplo `admin`                  |
| `custom` | Rol definido para un caso de uso particular, por ejemplo `viewer` |




### `scope`

Indica el ámbito al que aplica el rol.


| Valor     | Significado             |
| --------- | ----------------------- |
| `global`  | Toda la plataforma      |
| `users`   | Usuarios y asignaciones |
| `content` | Contenido               |
| `reports` | Reportes y consultas    |


Cuando se envía un valor de `type` o `scope`, debe pertenecer a su enumeración. Los valores no permitidos generan una respuesta `400 Bad Request`.

## Endpoints

[Colección de Postman](./obel-challenge.postman_collection.json)

## Arquitectura

La API sigue MVC con una capa de repositorio. Un request recorre las capas en este orden:

1. **Rutas** (`src/routes`): método, path y validación del body.
2. **Controladores** (`src/controllers`): leen params y body, llaman al servicio y arman el status y el JSON.
3. **Servicios** (`src/services`): reglas de negocio, como existencia del recurso, nombre único y asignaciones.
4. **Repositorios** (`src/repositories`): SQL contra SQLite.

Cada capa está dividida por recurso (`roles` y `users`). Lo que comparten ambos queda en módulos aparte:


| Carpeta           | Responsabilidad                                            |
| ----------------- | ---------------------------------------------------------- |
| `src/middlewares` | Autenticación, validación, not found, manejador de errores |
| `src/schemas`     | Zod schemas de validación                                  |
| `src/data`        | SQLite config e inicialización de db                       |
| `src/interfaces`  | Types e interfaces de entidades                            |
| `src/docs`        | Spec OpenApi / Swagger                                     |
| `src/utils`       | Utilidades                                                 |




## Documentación

La documentación Swagger UI está disponible en `/docs`.

- **Swagger UI:** [https://obel-challenge.vercel.app/docs/](https://obel-challenge.vercel.app/docs/)
## Producción

- **API:** [https://obel-challenge.vercel.app](https://obel-challenge.vercel.app)


