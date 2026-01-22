import express from "express";
import bcrypt from "bcryptjs";
import { db, nowIso } from "../db/db.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";

export const authRouter = express.Router();

authRouter.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { email, password } = parsed.data;
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'user', ?)")
    .run(email, hash, nowIso());

  const user = db.prepare("SELECT id, email, role, created_at FROM users WHERE id = ?").get(info.lastInsertRowid);
  const token = signToken(user);
  res.json({ token, user });
});

authRouter.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { email, password } = parsed.data;
  const row = db.prepare("SELECT id, email, role, password_hash, created_at FROM users WHERE email = ?").get(email);
  if (!row) return res.status(401).json({ message: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, row.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const user = { id: row.id, email: row.email, role: row.role, created_at: row.created_at };
  const token = signToken(user);
  res.json({ token, user });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
