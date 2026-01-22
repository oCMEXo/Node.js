import express from "express";
import { db } from "../db/db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const adminRouter = express.Router();

adminRouter.get("/users", requireAuth, requireAdmin, (req, res) => {
  res.json(db.prepare("SELECT id,email,role FROM users").all());
});

adminRouter.patch("/users/:id/role", requireAuth, requireAdmin, (req, res) => {
  const { role } = req.body;
  db.prepare("UPDATE users SET role=? WHERE id=?").run(role, req.params.id);
  res.json(db.prepare("SELECT id,email,role FROM users WHERE id=?").get(req.params.id));
});
