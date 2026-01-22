import Database from "better-sqlite3";
import dotenv from "dotenv";
dotenv.config();

const dbPath = process.env.DB_PATH || "./data/app.db";

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

export function nowIso() {
  return new Date().toISOString();
}
