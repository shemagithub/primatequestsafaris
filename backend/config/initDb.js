import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  seedTours,
  seedGallery,
  seedTestimonials,
  seedFaqs,
  seedSettings,
  seedPosts,
} from "../scripts/seed-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function dbConfig() {
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "primates_quest",
  };
}

function copySeedImages() {
  const uploadsDir = path.resolve(__dirname, "../uploads");
  const assetsDir = path.resolve(__dirname, "../../src/assets");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) return;
  for (const file of fs.readdirSync(assetsDir)) {
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) continue;
    const dest = path.join(uploadsDir, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(assetsDir, file), dest);
    }
  }
}

async function tableExists(conn, database, table) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = ? AND table_name = ? LIMIT 1`,
    [database, table],
  );
  return rows.length > 0;
}

async function countRows(conn, table) {
  const [rows] = await conn.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
  return Number(rows[0]?.count || 0);
}

export async function createDefaultAdmin(conn) {
  const email = (process.env.ADMIN_EMAIL || "admin@primatesquest.com").toLowerCase();
  const name = process.env.ADMIN_NAME || "Administrator";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hash = await bcrypt.hash(password, 10);
  await conn.query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    [name, email, hash],
  );
  return { email, password };
}

export async function ensureDatabase() {
  const config = dbConfig();
  copySeedImages();

  const root = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true,
  });

  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await root.query(`USE \`${config.database}\``);

  const schema = fs.readFileSync(path.resolve(__dirname, "../sql/schema.sql"), "utf8");
  await root.query(schema);

  const required = [
    "admins",
    "tours",
    "gallery_images",
    "inquiries",
    "testimonials",
    "faqs",
    "subscribers",
    "settings",
    "posts",
  ];
  for (const table of required) {
    if (!(await tableExists(root, config.database, table))) {
      throw new Error(`Table "${table}" was not created.`);
    }
  }

  if (!(await countRows(root, "admins"))) {
    const admin = await createDefaultAdmin(root);
    console.log(`Admin created: ${admin.email}`);
  }

  if (!(await countRows(root, "tours"))) {
    for (const tour of seedTours) {
      await root.query(
        `INSERT INTO tours (
          slug, title, park, duration, price, description, long_description,
          highlights, itinerary, inclusions, exclusions, difficulty, best_time,
          group_size, image, gallery, featured, published, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tour.slug,
          tour.title,
          tour.park,
          tour.duration,
          tour.price,
          tour.description,
          tour.long_description,
          JSON.stringify(tour.highlights),
          JSON.stringify(tour.itinerary),
          JSON.stringify(tour.inclusions),
          JSON.stringify(tour.exclusions),
          tour.difficulty,
          tour.best_time,
          tour.group_size,
          tour.image,
          JSON.stringify(tour.gallery),
          tour.featured,
          tour.published,
          tour.sort_order,
        ],
      );
    }
    console.log(`Seeded ${seedTours.length} tours.`);
  }

  if (!(await countRows(root, "gallery_images"))) {
    for (const item of seedGallery) {
      await root.query(
        "INSERT INTO gallery_images (src, alt, category, sort_order) VALUES (?, ?, ?, ?)",
        [item.src, item.alt, item.category, item.sort_order],
      );
    }
    console.log(`Seeded ${seedGallery.length} gallery images.`);
  }

  if (!(await countRows(root, "testimonials"))) {
    for (const item of seedTestimonials) {
      await root.query(
        "INSERT INTO testimonials (author, sub, text, sort_order, published) VALUES (?, ?, ?, ?, ?)",
        [item.author, item.sub, item.text, item.sort_order, item.published],
      );
    }
    console.log(`Seeded ${seedTestimonials.length} testimonials.`);
  }

  if (!(await countRows(root, "faqs"))) {
    for (const item of seedFaqs) {
      await root.query(
        "INSERT INTO faqs (question, answer, sort_order, published) VALUES (?, ?, ?, 1)",
        [item.question, item.answer, item.sort_order],
      );
    }
    console.log(`Seeded ${seedFaqs.length} FAQs.`);
  }

  if (!(await countRows(root, "posts"))) {
    for (const post of seedPosts) {
      await root.query(
        `INSERT INTO posts (slug, title, excerpt, body, image, gallery, category, author, published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.body,
          post.image,
          JSON.stringify(post.gallery || []),
          post.category,
          post.author,
          post.published ? 1 : 0,
          post.published_at,
        ],
      );
    }
    console.log(`Seeded ${seedPosts.length} blog posts.`);
  }

  if (!(await countRows(root, "settings"))) {
    for (const [key, value] of Object.entries(seedSettings)) {
      await root.query("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)", [
        key,
        value,
      ]);
    }
    console.log(`Seeded ${Object.keys(seedSettings).length} settings.`);
  } else {
    for (const [key, value] of Object.entries(seedSettings)) {
      await root.query(
        "INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)",
        [key, value],
      );
    }
  }

  await root.query(
    `DELETE FROM settings WHERE setting_key IN ('about_partner_title','about_partner_body','about_partner_cta')`,
  ).catch(() => {});
  await root.query(
    `UPDATE settings SET setting_value = ? WHERE setting_key = 'conservation_body' AND (setting_value LIKE '%Rwanda Development Board%' OR setting_value LIKE '%RDB Partner%')`,
    [
      "The survival of the mountain gorilla is one of the world's greatest conservation success stories. We dedicate a percentage of our profits to grassroots conservation efforts that protect forests, wildlife, and the communities who live beside them.",
    ],
  ).catch(() => {});

  await root.query(
    `ALTER TABLE inquiries
       MODIFY country VARCHAR(120) DEFAULT '',
       MODIFY tour_slug VARCHAR(500) DEFAULT '',
       MODIFY tour_title VARCHAR(500) DEFAULT '',
       MODIFY dates VARCHAR(180) DEFAULT ''`,
  ).catch(() => {});

  await root.query(
    `UPDATE settings SET setting_value = REPLACE(setting_value, 'Primates Quest Safaris', 'Primate Quest Safaris')
     WHERE setting_value LIKE '%Primates Quest Safaris%'`,
  ).catch(() => {});
  await root.query(
    `UPDATE settings SET setting_value = REPLACE(setting_value, 'Primates Quest', 'Primate Quest')
     WHERE setting_value LIKE '%Primates Quest%'`,
  ).catch(() => {});
  await root.query(
    `UPDATE posts SET author = REPLACE(author, 'Primates Quest Safaris', 'Primate Quest Safaris')
     WHERE author LIKE '%Primates Quest%'`,
  ).catch(() => {});
  await root.query(
    `UPDATE testimonials SET text = REPLACE(text, 'Primates Quest', 'Primate Quest')
     WHERE text LIKE '%Primates Quest%'`,
  ).catch(() => {});

  await root.query(`ALTER TABLE posts ADD COLUMN gallery JSON NULL`).catch(() => {});
  for (const post of seedPosts) {
    await root.query(
      `UPDATE posts SET gallery = ? WHERE slug = ? AND (gallery IS NULL OR JSON_LENGTH(gallery) = 0)`,
      [JSON.stringify(post.gallery || []), post.slug],
    ).catch(() => {});
  }

  await root.end();
  console.log("Database ready.");
}

let preparing;

export function resetDatabasePrep() {
  preparing = null;
}

export function ensureDatabaseOnce() {
  if (!preparing) {
    preparing = ensureDatabase().catch((err) => {
      preparing = null;
      throw err;
    });
  }
  return preparing;
}

let storyMediaReady;
export async function ensurePostStoryMedia() {
  if (storyMediaReady) return;
  const { query } = await import("./db.js");
  await query("ALTER TABLE posts ADD COLUMN gallery JSON NULL").catch(() => {});
  for (const post of seedPosts) {
    if (!post.gallery?.length) continue;
    await query(
      `UPDATE posts SET gallery = ? WHERE slug = ? AND COALESCE(JSON_LENGTH(gallery), 0) = 0`,
      [JSON.stringify(post.gallery), post.slug],
    ).catch(() => {});
  }
  storyMediaReady = true;
}
