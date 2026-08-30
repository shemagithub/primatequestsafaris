import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Sign in required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}

export async function loadAdmin(req, res, next) {
  try {
    const rows = await query("SELECT id, name, email FROM admins WHERE id = ? LIMIT 1", [
      req.admin.id,
    ]);
    if (!rows.length) {
      return res.status(401).json({ error: "Admin account not found." });
    }
    req.adminUser = rows[0];
    next();
  } catch (err) {
    next(err);
  }
}
