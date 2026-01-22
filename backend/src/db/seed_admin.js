import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { db, nowIso } from "./db.js";

const email = "admin@example.com";
const password = "admin12345";

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (existing) {
  console.log("Admin already exists:", email);
  process.exit(0);
}

const hash = bcrypt.hashSync(password, 10);
db.prepare("INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
  .run(email, hash, nowIso());

console.log("Seeded admin:", { email, password });
