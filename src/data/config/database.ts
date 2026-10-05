import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync(":memory:");

db.exec("PRAGMA foreign_keys = ON");