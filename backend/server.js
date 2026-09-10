import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { getPool } from "./config/db.js";
import { ensureDatabaseOnce } from "./config/initDb.js";
import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { requireAuth } from "./middleware/auth.js";
import { verifyMailer } from "./utils/mailer.js";
import { buildSitemapXml } from "./utils/sitemap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Copy .env.example to .env before going live.");
  process.env.JWT_SECRET = "dev-only-secret-change-me";
}

const SITE_URL = String(process.env.SITE_URL || "https://primatequestsafaris.com").replace(/\/$/, "");
const passenger = globalThis.PhusionPassenger;
if (passenger) {
  passenger.configure({ autoInstall: false });
}

const app = express();
const port = Number(process.env.PORT || 4000);
const adminDir = path.join(__dirname, "public/admin");

function corsOrigins() {
  const extras = String(process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return [
    SITE_URL,
    "https://primatequestsafaris.com",
    "https://www.primatequestsafaris.com",
    "https://backend.primatequestsafaris.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    ...extras,
  ];
}

function resolveClientDir() {
  const fromEnv = process.env.CLIENT_DIR
    ? path.resolve(__dirname, process.env.CLIENT_DIR)
    : null;
  const candidates = [
    fromEnv,
    path.join(__dirname, "client"),
    path.join(__dirname, "../dist"),
  ].filter(Boolean);
  return candidates.find((dir) => fs.existsSync(path.join(dir, "index.html"))) || null;
}

const clientDir = resolveClientDir();
const allowedOrigins = corsOrigins();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

function cpanelPing(_req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<!doctype html><title>Primate Quest API</title>OK");
}
app.get("/", cpanelPing);
app.head("/", cpanelPing);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", express.static(adminDir));

app.get("/sitemap.xml", async (_req, res) => {
  try {
    await ensureDatabaseOnce();
    const xml = await buildSitemapXml();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err.message);
    res.status(503).type("text").send("Sitemap unavailable");
  }
});

if (clientDir) {
  app.use(express.static(clientDir, { index: false }));
} else {
  app.use(express.static(path.join(__dirname, "../public")));
}

app.use("/api", async (_req, _res, next) => {
  try {
    await ensureDatabaseOnce();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ ok: true, database: "connected", site: SITE_URL });
  } catch (err) {
    res.status(500).json({ ok: false, database: "disconnected", error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", requireAuth, adminRoutes);

app.get(["/admin", "/admin/"], (_req, res) => {
  res.sendFile(path.join(adminDir, "index.html"));
});

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  if (req.path === "/sitemap.xml") return next();
  if (req.path.startsWith("/admin")) {
    return res.sendFile(path.join(adminDir, "index.html"));
  }
  if (clientDir) {
    return res.sendFile(path.join(clientDir, "index.html"));
  }
  next();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong.",
  });
});

async function start() {
  const listenTarget = passenger ? "passenger" : port;
  app.listen(listenTarget, () => {
    const envPath = path.join(__dirname, ".env");
    if (!fs.existsSync(envPath)) {
      console.warn("No backend/.env file found. Copy .env.example to .env.");
    }
    console.log(`Primate Quest API running (${passenger ? "cPanel Passenger" : `port ${port}`})`);
    console.log(`Public site: ${SITE_URL}`);
    console.log(`Admin panel: https://backend.primatequestsafaris.com/admin`);
    verifyMailer();
    ensureDatabaseOnce().catch((err) => {
      console.error("Database is not ready yet:", err.message);
      console.error("Tables will be created automatically as soon as MySQL is available.");
    });
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
