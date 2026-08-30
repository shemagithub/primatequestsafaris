export function parseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function mapTour(row, { includeUnpublished = false } = {}) {
  if (!row) return null;
  if (!includeUnpublished && !row.published) return null;
  return {
    id: row.slug,
    dbId: row.id,
    slug: row.slug,
    title: row.title,
    park: row.park,
    duration: row.duration,
    price: row.price,
    description: row.description,
    longDescription: row.long_description,
    highlights: parseJson(row.highlights, []),
    itinerary: parseJson(row.itinerary, []),
    inclusions: parseJson(row.inclusions, []),
    exclusions: parseJson(row.exclusions, []),
    difficulty: row.difficulty,
    bestTime: row.best_time,
    groupSize: row.group_size,
    image: row.image,
    gallery: parseJson(row.gallery, []),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPost(row, { includeUnpublished = false } = {}) {
  if (!row) return null;
  if (!includeUnpublished && !row.published) return null;
  return {
    id: row.slug,
    dbId: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    body: row.body || "",
    image: row.image || "",
    gallery: parseJson(row.gallery, []),
    category: row.category || "Safari",
    author: row.author || "Primates Quest Safaris",
    published: Boolean(row.published),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toBool(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

const DROPPED_SETTING_KEYS = new Set([
  "about_partner_title",
  "about_partner_body",
  "about_partner_cta",
]);

export const CLEAN_CONSERVATION_BODY =
  "The survival of the mountain gorilla is one of the world's greatest conservation success stories. We dedicate a percentage of our profits to grassroots conservation efforts that protect forests, wildlife, and the communities who live beside them.";

export function isDroppedSettingKey(key) {
  return DROPPED_SETTING_KEYS.has(String(key));
}

export function sanitizeSettings(settings = {}) {
  const next = { ...settings };
  for (const key of DROPPED_SETTING_KEYS) delete next[key];
  if (/Rwanda Development Board|RDB Partner|\bRDB\b/i.test(next.conservation_body || "")) {
    next.conservation_body = CLEAN_CONSERVATION_BODY;
  }
  return next;
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
