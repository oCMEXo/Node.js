import express from "express";
import { db } from "../db/db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { roleUpdateSchema } from "../validation/schemas.js";

export const adminRouter = express.Router();

adminRouter.get("/users", requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare("SELECT id, email, role, created_at FROM users ORDER BY id ASC").all();
  res.json(users);
});

adminRouter.patch("/users/:id/role", requireAuth, requireAdmin, (req, res) => {
  const targetId = Number(req.params.id);
  const parsed = roleUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const target = db.prepare("SELECT id, email, role, created_at FROM users WHERE id = ?").get(targetId);
  if (!target) return res.status(404).json({ message: "User not found" });

  // optional guard: don't allow changing own role
  // if (targetId === req.user.id) return res.status(400).json({ message: "Cannot change your own role" });

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(parsed.data.role, targetId);
  const updated = db.prepare("SELECT id, email, role, created_at FROM users WHERE id = ?").get(targetId);
  res.json(updated);
});
