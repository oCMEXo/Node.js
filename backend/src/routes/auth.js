import express from "express";
import bcrypt from "bcryptjs";
import { db, nowIso } from "../db/db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO users (email,password_hash,role,created_at) VALUES (?,?, 'user', ?)")
    .run(email, hash, nowIso());

  const user = db.prepare("SELECT id,email,role FROM users WHERE id=?").get(info.lastInsertRowid);
  const token = signToken(user);
  res.json({ user, token });
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash))
    return res.status(401).json({ message: "Invalid credentials" });

  const user = { id: row.id, email: row.email, role: row.role };
  const token = signToken(user);
  res.json({ user, token });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
