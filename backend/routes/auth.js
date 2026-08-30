import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { requireAuth, loadAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/helpers.js";
import { ensureDatabaseOnce } from "../config/initDb.js";

const router = Router();

async function findAdminByEmail(email) {
  try {
    return await query("SELECT * FROM admins WHERE email = ? LIMIT 1", [email]);
  } catch (err) {
    if (err.code === "ER_NO_SUCH_TABLE" || err.code === "ER_BAD_DB_ERROR") {
      await ensureDatabaseOnce();
      return await query("SELECT * FROM admins WHERE email = ? LIMIT 1", [email]);
    }
    throw err;
  }
}

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    await ensureDatabaseOnce();

    let rows = await findAdminByEmail(email);
    if (!rows[0]) {
      const counts = await query("SELECT COUNT(*) AS count FROM admins");
      if (!counts[0].count) {
        await ensureDatabaseOnce();
        rows = await findAdminByEmail(email);
      }
    }

    const admin = rows[0];
    const passwordOk = admin ? await bcrypt.compare(password, admin.password_hash) : false;
    if (!admin || !passwordOk) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  }),
);

router.get(
  "/me",
  requireAuth,
  loadAdmin,
  asyncHandler(async (req, res) => {
    res.json(req.adminUser);
  }),
);

router.put(
  "/password",
  requireAuth,
  loadAdmin,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    const rows = await query("SELECT password_hash FROM admins WHERE id = ?", [req.adminUser.id]);
    if (!(await bcrypt.compare(currentPassword, rows[0].password_hash))) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const hash = await bcrypt.hash(String(newPassword), 10);
    await query("UPDATE admins SET password_hash = ? WHERE id = ?", [hash, req.adminUser.id]);
    res.json({ ok: true });
  }),
);

router.put(
  "/profile",
  requireAuth,
  loadAdmin,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    await query("UPDATE admins SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      req.adminUser.id,
    ]);
    res.json({ id: req.adminUser.id, name, email });
  }),
);

export default router;
