import { db } from "./config/database";
import { Role } from "../interfaces/interfaces";

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      type TEXT,
      scope TEXT
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );
  `);

  const users = [
    { id: 1, username: "Pedro" },
    { id: 2, username: "Alberto" },
    { id: 3, username: "Ana" },
    { id: 4, username: "Juan" },
    { id: 5, username: "Lucía" },
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, username)
    VALUES (?, ?)
    ON CONFLICT(id) DO NOTHING
  `);

  for (const user of users) {
    insertUser.run(user.id, user.username);
  }


//   const roles: Role[] = [
//     {
//       id: 1,
//       name: "admin",
//       description: "Administrador del sistema",
//       type: "system",
//       scope: "global",
//     },
//     {
//       id: 2,
//       name: "editor",
//       description: "Editor de contenido",
//       type: "system",
//       scope: "global",
//     },
//   ];

//   const insertRole = db.prepare(`
//   INSERT INTO roles (id, name, description, type, scope)
//   VALUES (?, ?, ?, ?, ?)
//   ON CONFLICT(id) DO NOTHING
// `);

//   for (const role of roles) {
//     insertRole.run(
//       role.id,
//       role.name,
//       role.description,
//       role.type,
//       role.scope
//     );
//   }

//   const insertAssignment = db.prepare(`
//   INSERT INTO user_roles (user_id, role_id)
//   VALUES (?, ?)
//   ON CONFLICT(user_id, role_id) DO NOTHING
// `);

//   insertAssignment.run(1, 1); // Pedro → admin
//   insertAssignment.run(1, 2); // Pedro → editor
//   insertAssignment.run(2, 2); // Alberto → editor
}