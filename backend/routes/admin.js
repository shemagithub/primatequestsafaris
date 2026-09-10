import { Router } from "express";
import { query } from "../config/db.js";
import { ensurePostStoryMedia } from "../config/initDb.js";
import { upload } from "../middleware/upload.js";
import {
  asyncHandler,
  CLEAN_CONSERVATION_BODY,
  isDroppedSettingKey,
  mapPost,
  mapTour,
  sanitizeSettings,
  slugify,
  toBool,
} from "../utils/helpers.js";

const router = Router();
const BUDGET_LABELS = ["Under $500", "$500–$1,500", "$1,500–$3,500", "$3,500+"];

function asJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(fallback);
}

function mapInquiry(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    language: row.language,
    tourSlug: row.tour_slug,
    tourTitle: row.tour_title,
    dates: row.dates,
    guests: row.guests,
    budget: row.budget,
    budgetLabel: BUDGET_LABELS[row.budget] || BUDGET_LABELS[1],
    message: row.message,
    dietary: row.dietary,
    source: row.source,
    whatsappPref: Boolean(row.whatsapp_pref),
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [[tours]] = [await query("SELECT COUNT(*) AS count FROM tours")];
    const [[published]] = [await query("SELECT COUNT(*) AS count FROM tours WHERE published = 1")];
    const [[inquiries]] = [await query("SELECT COUNT(*) AS count FROM inquiries")];
    const [[newInquiries]] = [
      await query("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new'"),
    ];
    const [[gallery]] = [await query("SELECT COUNT(*) AS count FROM gallery_images")];
    const [[subscribers]] = [await query("SELECT COUNT(*) AS count FROM subscribers")];
    const [[testimonials]] = [await query("SELECT COUNT(*) AS count FROM testimonials")];
    const [[faqs]] = [await query("SELECT COUNT(*) AS count FROM faqs")];
    let postCount = 0;
    try {
      const [[posts]] = [await query("SELECT COUNT(*) AS count FROM posts")];
      postCount = Number(posts.count || 0);
    } catch {
      postCount = 0;
    }

    const statusRows = await query(
      "SELECT status, COUNT(*) AS count FROM inquiries GROUP BY status",
    );
    const recent = await query(
      "SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 8",
    );

    res.json({
      stats: {
        tours: tours.count,
        publishedTours: published.count,
        inquiries: inquiries.count,
        newInquiries: newInquiries.count,
        gallery: gallery.count,
        subscribers: subscribers.count,
        testimonials: testimonials.count,
        faqs: faqs.count,
        posts: postCount,
      },
      inquiryStatus: statusRows,
      recentInquiries: recent.map(mapInquiry),
    });
  }),
);

router.get(
  "/tours",
  asyncHandler(async (_req, res) => {
    const rows = await query("SELECT * FROM tours ORDER BY sort_order ASC, id ASC");
    res.json(rows.map((row) => mapTour(row, { includeUnpublished: true })));
  }),
);

router.get(
  "/tours/:id",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM tours WHERE id = ? LIMIT 1", [req.params.id]);
    const tour = mapTour(rows[0], { includeUnpublished: true });
    if (!tour) return res.status(404).json({ error: "Tour not found." });
    res.json(tour);
  }),
);

router.post(
  "/tours",
  asyncHandler(async (req, res) => {
    const body = req.body;
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "Title is required." });

    let slug = slugify(body.slug || title);
    const existing = await query("SELECT id FROM tours WHERE slug = ?", [slug]);
    if (existing.length) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const result = await query(
      `INSERT INTO tours (
        slug, title, park, duration, price, description, long_description,
        highlights, itinerary, inclusions, exclusions, difficulty, best_time,
        group_size, image, gallery, featured, published, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        String(body.park || ""),
        String(body.duration || ""),
        String(body.price || ""),
        String(body.description || ""),
        String(body.longDescription || body.long_description || ""),
        asJson(body.highlights, []),
        asJson(body.itinerary, []),
        asJson(body.inclusions, []),
        asJson(body.exclusions, []),
        String(body.difficulty || ""),
        String(body.bestTime || body.best_time || ""),
        String(body.groupSize || body.group_size || ""),
        String(body.image || ""),
        asJson(body.gallery, []),
        toBool(body.featured) ? 1 : 0,
        body.published === undefined ? 1 : toBool(body.published) ? 1 : 0,
        Number(body.sortOrder || body.sort_order || 0),
      ],
    );

    const rows = await query("SELECT * FROM tours WHERE id = ?", [result.insertId]);
    res.status(201).json(mapTour(rows[0], { includeUnpublished: true }));
  }),
);

router.put(
  "/tours/:id",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM tours WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Tour not found." });

    const body = req.body;
    const title = String(body.title || rows[0].title).trim();
    let slug = slugify(body.slug || rows[0].slug || title);
    const clash = await query("SELECT id FROM tours WHERE slug = ? AND id != ?", [
      slug,
      req.params.id,
    ]);
    if (clash.length) slug = `${slug}-${req.params.id}`;

    await query(
      `UPDATE tours SET
        slug=?, title=?, park=?, duration=?, price=?, description=?, long_description=?,
        highlights=?, itinerary=?, inclusions=?, exclusions=?, difficulty=?, best_time=?,
        group_size=?, image=?, gallery=?, featured=?, published=?, sort_order=?
      WHERE id=?`,
      [
        slug,
        title,
        String(body.park ?? rows[0].park),
        String(body.duration ?? rows[0].duration),
        String(body.price ?? rows[0].price),
        String(body.description ?? rows[0].description),
        String(body.longDescription ?? body.long_description ?? rows[0].long_description),
        asJson(body.highlights ?? rows[0].highlights, []),
        asJson(body.itinerary ?? rows[0].itinerary, []),
        asJson(body.inclusions ?? rows[0].inclusions, []),
        asJson(body.exclusions ?? rows[0].exclusions, []),
        String(body.difficulty ?? rows[0].difficulty),
        String(body.bestTime ?? body.best_time ?? rows[0].best_time),
        String(body.groupSize ?? body.group_size ?? rows[0].group_size),
        String(body.image ?? rows[0].image),
        asJson(body.gallery ?? rows[0].gallery, []),
        toBool(body.featured ?? rows[0].featured) ? 1 : 0,
        toBool(body.published ?? rows[0].published) ? 1 : 0,
        Number(body.sortOrder ?? body.sort_order ?? rows[0].sort_order),
        req.params.id,
      ],
    );

    const updated = await query("SELECT * FROM tours WHERE id = ?", [req.params.id]);
    res.json(mapTour(updated[0], { includeUnpublished: true }));
  }),
);

router.delete(
  "/tours/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM tours WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/posts",
  asyncHandler(async (_req, res) => {
    await ensurePostStoryMedia();
    const rows = await query(
      "SELECT * FROM posts ORDER BY COALESCE(published_at, created_at) DESC, id DESC",
    );
    res.json(rows.map((row) => mapPost(row, { includeUnpublished: true })));
  }),
);

router.get(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM posts WHERE id = ? LIMIT 1", [req.params.id]);
    const post = mapPost(rows[0], { includeUnpublished: true });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  }),
);

router.post(
  "/posts",
  asyncHandler(async (req, res) => {
    const body = req.body;
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "Title is required." });

    let slug = slugify(body.slug || title);
    const existing = await query("SELECT id FROM posts WHERE slug = ?", [slug]);
    if (existing.length) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const published = body.published === undefined ? 1 : toBool(body.published) ? 1 : 0;
    const publishedAt = body.publishedAt || body.published_at || (published ? new Date() : null);

    const result = await query(
      `INSERT INTO posts (slug, title, excerpt, body, image, gallery, category, author, published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        String(body.excerpt || ""),
        String(body.body || ""),
        String(body.image || ""),
        asJson(body.gallery, []),
        String(body.category || "Safari"),
        String(body.author || "Primate Quest Safaris"),
        published,
        publishedAt,
      ],
    );
    const created = await query("SELECT * FROM posts WHERE id = ?", [result.insertId]);
    res.status(201).json(mapPost(created[0], { includeUnpublished: true }));
  }),
);

router.put(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM posts WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Post not found." });

    const body = req.body;
    const title = String(body.title || rows[0].title).trim();
    if (!title) return res.status(400).json({ error: "Title is required." });

    let slug = slugify(body.slug || title || rows[0].slug);
    const clash = await query("SELECT id FROM posts WHERE slug = ? AND id != ?", [slug, req.params.id]);
    if (clash.length) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const published = toBool(body.published) ? 1 : 0;
    let publishedAt = body.publishedAt || body.published_at || rows[0].published_at;
    if (published && !publishedAt) publishedAt = new Date();
    if (!published) publishedAt = publishedAt || null;

    await query(
      `UPDATE posts SET
        slug = ?, title = ?, excerpt = ?, body = ?, image = ?, gallery = ?, category = ?, author = ?,
        published = ?, published_at = ?
       WHERE id = ?`,
      [
        slug,
        title,
        String(body.excerpt ?? rows[0].excerpt ?? ""),
        String(body.body ?? rows[0].body ?? ""),
        String(body.image ?? rows[0].image ?? ""),
        asJson(body.gallery !== undefined ? body.gallery : rows[0].gallery, []),
        String(body.category ?? rows[0].category ?? "Safari"),
        String(body.author ?? rows[0].author ?? "Primate Quest Safaris"),
        published,
        publishedAt,
        req.params.id,
      ],
    );
    const updated = await query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
    res.json(mapPost(updated[0], { includeUnpublished: true }));
  }),
);

router.delete(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, src, alt, category, sort_order AS sortOrder, created_at AS createdAt FROM gallery_images ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows);
  }),
);

router.post(
  "/gallery",
  asyncHandler(async (req, res) => {
    const src = String(req.body.src || "").trim();
    if (!src) return res.status(400).json({ error: "Image is required." });
    const result = await query(
      "INSERT INTO gallery_images (src, alt, category, sort_order) VALUES (?, ?, ?, ?)",
      [
        src,
        String(req.body.alt || ""),
        String(req.body.category || "Safari"),
        Number(req.body.sortOrder || 0),
      ],
    );
    const rows = await query(
      "SELECT id, src, alt, category, sort_order AS sortOrder FROM gallery_images WHERE id = ?",
      [result.insertId],
    );
    res.status(201).json(rows[0]);
  }),
);

router.put(
  "/gallery/:id",
  asyncHandler(async (req, res) => {
    await query(
      "UPDATE gallery_images SET src=?, alt=?, category=?, sort_order=? WHERE id=?",
      [
        String(req.body.src || ""),
        String(req.body.alt || ""),
        String(req.body.category || "Safari"),
        Number(req.body.sortOrder || 0),
        req.params.id,
      ],
    );
    const rows = await query(
      "SELECT id, src, alt, category, sort_order AS sortOrder FROM gallery_images WHERE id = ?",
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Image not found." });
    res.json(rows[0]);
  }),
);

router.delete(
  "/gallery/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM gallery_images WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/inquiries",
  asyncHandler(async (req, res) => {
    const status = String(req.query.status || "");
    const search = String(req.query.q || "").trim();
    let sql = "SELECT * FROM inquiries WHERE 1=1";
    const params = [];
    if (status && status !== "all") {
      sql += " AND status = ?";
      params.push(status);
    }
    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ? OR tour_title LIKE ? OR phone LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += " ORDER BY created_at DESC";
    const rows = await query(sql, params);
    res.json(rows.map(mapInquiry));
  }),
);

router.get(
  "/inquiries/:id",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM inquiries WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Inquiry not found." });
    res.json(mapInquiry(rows[0]));
  }),
);

router.put(
  "/inquiries/:id",
  asyncHandler(async (req, res) => {
    const allowed = ["new", "contacted", "quoted", "booked", "closed"];
    const status = allowed.includes(req.body.status) ? req.body.status : undefined;
    const notes = req.body.notes !== undefined ? String(req.body.notes) : undefined;

    if (status) {
      await query("UPDATE inquiries SET status = ? WHERE id = ?", [status, req.params.id]);
    }
    if (notes !== undefined) {
      await query("UPDATE inquiries SET notes = ? WHERE id = ?", [notes, req.params.id]);
    }

    const rows = await query("SELECT * FROM inquiries WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Inquiry not found." });
    res.json(mapInquiry(rows[0]));
  }),
);

router.delete(
  "/inquiries/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM inquiries WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, author, sub, text, sort_order AS sortOrder, published, created_at AS createdAt FROM testimonials ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows.map((row) => ({ ...row, published: Boolean(row.published) })));
  }),
);

router.post(
  "/testimonials",
  asyncHandler(async (req, res) => {
    if (!req.body.author || !req.body.text) {
      return res.status(400).json({ error: "Author and quote are required." });
    }
    const result = await query(
      "INSERT INTO testimonials (author, sub, text, sort_order, published) VALUES (?, ?, ?, ?, ?)",
      [
        String(req.body.author),
        String(req.body.sub || ""),
        String(req.body.text),
        Number(req.body.sortOrder || 0),
        toBool(req.body.published ?? true) ? 1 : 0,
      ],
    );
    const rows = await query(
      "SELECT id, author, sub, text, sort_order AS sortOrder, published FROM testimonials WHERE id = ?",
      [result.insertId],
    );
    res.status(201).json({ ...rows[0], published: Boolean(rows[0].published) });
  }),
);

router.put(
  "/testimonials/:id",
  asyncHandler(async (req, res) => {
    await query(
      "UPDATE testimonials SET author=?, sub=?, text=?, sort_order=?, published=? WHERE id=?",
      [
        String(req.body.author || ""),
        String(req.body.sub || ""),
        String(req.body.text || ""),
        Number(req.body.sortOrder || 0),
        toBool(req.body.published) ? 1 : 0,
        req.params.id,
      ],
    );
    const rows = await query(
      "SELECT id, author, sub, text, sort_order AS sortOrder, published FROM testimonials WHERE id = ?",
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Testimonial not found." });
    res.json({ ...rows[0], published: Boolean(rows[0].published) });
  }),
);

router.delete(
  "/testimonials/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM testimonials WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/faqs",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, question, answer, sort_order AS sortOrder, published FROM faqs ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows.map((row) => ({ ...row, published: Boolean(row.published) })));
  }),
);

router.post(
  "/faqs",
  asyncHandler(async (req, res) => {
    if (!req.body.question || !req.body.answer) {
      return res.status(400).json({ error: "Question and answer are required." });
    }
    const result = await query(
      "INSERT INTO faqs (question, answer, sort_order, published) VALUES (?, ?, ?, ?)",
      [
        String(req.body.question),
        String(req.body.answer),
        Number(req.body.sortOrder || 0),
        toBool(req.body.published ?? true) ? 1 : 0,
      ],
    );
    const rows = await query(
      "SELECT id, question, answer, sort_order AS sortOrder, published FROM faqs WHERE id = ?",
      [result.insertId],
    );
    res.status(201).json({ ...rows[0], published: Boolean(rows[0].published) });
  }),
);

router.put(
  "/faqs/:id",
  asyncHandler(async (req, res) => {
    await query(
      "UPDATE faqs SET question=?, answer=?, sort_order=?, published=? WHERE id=?",
      [
        String(req.body.question || ""),
        String(req.body.answer || ""),
        Number(req.body.sortOrder || 0),
        toBool(req.body.published) ? 1 : 0,
        req.params.id,
      ],
    );
    const rows = await query(
      "SELECT id, question, answer, sort_order AS sortOrder, published FROM faqs WHERE id = ?",
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "FAQ not found." });
    res.json({ ...rows[0], published: Boolean(rows[0].published) });
  }),
);

router.delete(
  "/faqs/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM faqs WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/subscribers",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, email, created_at AS createdAt FROM subscribers ORDER BY created_at DESC",
    );
    res.json(rows);
  }),
);

router.delete(
  "/subscribers/:id",
  asyncHandler(async (req, res) => {
    await query("DELETE FROM subscribers WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  }),
);

router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    const rows = await query("SELECT setting_key, setting_value FROM settings");
    const settings = {};
    for (const row of rows) settings[row.setting_key] = row.setting_value;
    res.json(sanitizeSettings(settings));
  }),
);

router.put(
  "/settings",
  asyncHandler(async (req, res) => {
    const entries = Object.entries(req.body || {});
    for (const [key, value] of entries) {
      if (isDroppedSettingKey(key)) continue;
      let stored = value == null ? "" : String(value);
      if (
        key === "conservation_body" &&
        /Rwanda Development Board|RDB Partner|\bRDB\b/i.test(stored)
      ) {
        stored = CLEAN_CONSERVATION_BODY;
      }
      await query(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [String(key), stored],
      );
    }
    const rows = await query("SELECT setting_key, setting_value FROM settings");
    const settings = {};
    for (const row of rows) settings[row.setting_key] = row.setting_value;
    res.json(sanitizeSettings(settings));
  }),
);

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  }),
);

export default router;
