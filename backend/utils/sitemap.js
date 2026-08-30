import { query } from "../config/db.js";

const STATIC_PATHS = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/tours", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/gallery", changefreq: "weekly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

function publicSiteUrl() {
  const raw = String(process.env.SITE_URL || process.env.FRONTEND_ORIGIN || "https://primatequestsafaris.com").replace(
    /\/$/,
    "",
  );
  if (/localhost|127\.0\.0\.1/.test(raw)) return "https://primatequestsafaris.com";
  return raw;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urlEntry(loc, { lastmod, changefreq, priority } = {}) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function buildSitemapXml() {
  const origin = publicSiteUrl();
  const today = new Date().toISOString().slice(0, 10);
  const entries = STATIC_PATHS.map((item) =>
    urlEntry(`${origin}${item.path}`, {
      lastmod: today,
      changefreq: item.changefreq,
      priority: item.priority,
    }),
  );

  try {
    const tours = await query(
      "SELECT slug, updated_at FROM tours WHERE published = 1 ORDER BY sort_order ASC, id ASC",
    );
    for (const tour of tours) {
      const lastmod = tour.updated_at
        ? new Date(tour.updated_at).toISOString().slice(0, 10)
        : today;
      entries.push(
        urlEntry(`${origin}/tours/${tour.slug}`, {
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        }),
      );
    }
  } catch {
    // Keep the static pages even if the database is unavailable.
  }

  try {
    const posts = await query(
      "SELECT slug, updated_at, published_at FROM posts WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC",
    );
    for (const post of posts) {
      const stamp = post.updated_at || post.published_at;
      const lastmod = stamp ? new Date(stamp).toISOString().slice(0, 10) : today;
      entries.push(
        urlEntry(`${origin}/blog/${post.slug}`, {
          lastmod,
          changefreq: "monthly",
          priority: "0.6",
        }),
      );
    }
  } catch {
    // Blog URLs are optional if the table is not ready yet.
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
