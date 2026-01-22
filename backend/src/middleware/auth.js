import jwt from "jsonwebtoken";
import { db } from "../db/db.js";

const SECRET = process.env.JWT_SECRET || "dev";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const p = jwt.verify(token, SECRET);
    const user = db.prepare("SELECT id,email,role FROM users WHERE id=?").get(p.sub);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}
