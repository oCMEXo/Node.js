import fs from "node:fs";
import path from "node:path";
import { db } from "./db.js";

const migrationsDir = path.resolve("src/db/migrations");

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL
  );
`);

const applied = new Set(
  db.prepare("SELECT filename FROM migrations").all().map(r => r.filename)
);

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith(".sql"))
  .sort((a,b) => a.localeCompare(b));

for (const file of files) {
  if (applied.has(file)) continue;
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
  console.log("Applying migration:", file);
  db.exec("BEGIN");
  try {
    db.exec(sql);
    db.prepare("INSERT INTO migrations (filename, applied_at) VALUES (?, ?)").run(file, new Date().toISOString());
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    console.error("Migration failed:", file);
    throw e;
  }
}

console.log("Migrations done.");
