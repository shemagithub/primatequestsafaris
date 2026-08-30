import { Router } from "express";
import { query } from "../config/db.js";
import { ensurePostStoryMedia } from "../config/initDb.js";
import { asyncHandler, mapPost, mapTour, sanitizeSettings } from "../utils/helpers.js";
import { sendMailSafe, mailConfig } from "../utils/mailer.js";
import { inquiryAdminEmail, inquiryGuestEmail, subscriberAdminEmail, subscriberEmail } from "../utils/emailTemplates.js";

const router = Router();
const BUDGET_LABELS = ["Under $500", "$500–$1,500", "$1,500–$3,500", "$3,500+"];

router.get(
  "/tours",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT * FROM tours WHERE published = 1 ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows.map((row) => mapTour(row)).filter(Boolean));
  }),
);

router.get(
  "/tours/:slug",
  asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM tours WHERE slug = ? AND published = 1 LIMIT 1", [
      req.params.slug,
    ]);
    const tour = mapTour(rows[0]);
    if (!tour) return res.status(404).json({ error: "Tour not found." });
    res.json(tour);
  }),
);

router.get(
  "/posts",
  asyncHandler(async (_req, res) => {
    await ensurePostStoryMedia();
    const rows = await query(
      "SELECT * FROM posts WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC, id DESC",
    );
    res.json(rows.map((row) => mapPost(row)).filter(Boolean));
  }),
);

router.get(
  "/posts/:slug",
  asyncHandler(async (req, res) => {
    await ensurePostStoryMedia();
    const rows = await query("SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1", [
      req.params.slug,
    ]);
    const post = mapPost(rows[0]);
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  }),
);

router.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, src, alt, category, sort_order AS sortOrder FROM gallery_images ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows);
  }),
);

router.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, author, sub, text, sort_order AS sortOrder FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows);
  }),
);

router.get(
  "/faqs",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      "SELECT id, question, answer, sort_order AS sortOrder FROM faqs WHERE published = 1 ORDER BY sort_order ASC, id ASC",
    );
    res.json(rows);
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

router.post(
  "/inquiries",
  asyncHandler(async (req, res) => {
    const {
      name,
      email,
      phone,
      country,
      language,
      tour,
      tours,
      dates,
      guests,
      budget,
      message,
      dietary,
      source,
      whatsappPref,
    } = req.body;

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!phone) return res.status(400).json({ error: "Phone number is required." });
    if (!country) return res.status(400).json({ error: "Country is required." });

    const selected = Array.isArray(tours)
      ? tours.map((item) => String(item || "").trim()).filter(Boolean)
      : String(tour || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    if (!selected.length) return res.status(400).json({ error: "Please select at least one expedition." });
    if (!dates) return res.status(400).json({ error: "Travel dates are required." });

    const titles = [];
    for (const slug of selected) {
      if (slug === "custom") {
        titles.push("Custom Itinerary");
        continue;
      }
      const found = await query("SELECT title FROM tours WHERE slug = ? LIMIT 1", [slug]);
      titles.push(found[0]?.title || slug);
    }

    const inquiry = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      country: String(country).trim(),
      language: String(language || "English"),
      tours: titles.join(" · "),
      dates: String(dates).trim(),
      guests: String(Math.max(1, Math.min(20, Number(guests) || 1))),
      budgetLabel: BUDGET_LABELS[Math.max(0, Math.min(3, Number(budget) || 1))],
      message: String(message || "").slice(0, 500),
      dietary: String(dietary || ""),
      source: String(source || ""),
      whatsappPref: Boolean(whatsappPref),
    };

    const result = await query(
      `INSERT INTO inquiries (
        name, email, phone, country, language, tour_slug, tour_title, dates,
        guests, budget, message, dietary, source, whatsapp_pref
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.country,
        inquiry.language,
        selected.join(","),
        inquiry.tours,
        inquiry.dates,
        Number(inquiry.guests),
        Math.max(0, Math.min(3, Number(budget) || 1)),
        inquiry.message,
        inquiry.dietary,
        inquiry.source,
        inquiry.whatsappPref ? 1 : 0,
      ],
    );

    const inquiryId = result.insertId;
    const notify = mailConfig().notify;
    const guestMail = inquiryGuestEmail(inquiry);
    const adminMail = inquiryAdminEmail(inquiry);
    const [guestSent, adminSent] = await Promise.all([
      sendMailSafe({ to: inquiry.email, ...guestMail }),
      sendMailSafe({ to: notify, replyTo: inquiry.email, ...adminMail }),
    ]);
    console.log(
      `Inquiry #${inquiryId} saved for ${inquiry.email}. Guest email: ${guestSent ? "sent" : "failed"}. Admin email: ${adminSent ? "sent" : "failed"}.`,
    );

    res.status(201).json({
      ok: true,
      id: inquiryId,
      budgetLabel: inquiry.budgetLabel,
      emailed: { guest: guestSent, admin: adminSent },
    });
  }),
);

router.post(
  "/subscribers",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }

    let isNew = true;
    try {
      await query("INSERT INTO subscribers (email) VALUES (?)", [email]);
    } catch (err) {
      if (err.code !== "ER_DUP_ENTRY") throw err;
      isNew = false;
    }

    if (isNew) {
      const notify = mailConfig().notify;
      const welcome = subscriberEmail(email);
      const adminMail = subscriberAdminEmail(email);
      const [guestSent, adminSent] = await Promise.all([
        sendMailSafe({ to: email, ...welcome }),
        sendMailSafe({ to: notify, ...adminMail }),
      ]);
      console.log(
        `Subscriber saved: ${email}. Welcome email: ${guestSent ? "sent" : "failed"}. Admin email: ${adminSent ? "sent" : "failed"}.`,
      );
    }

    res.status(201).json({ ok: true, alreadySubscribed: !isNew });
  }),
);

export default router;
