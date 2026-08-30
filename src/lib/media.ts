const rawApi = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const API_ORIGIN = rawApi;

export function mediaUrl(src?: string | null): string {
  if (src == null || src === "") return "";
  const value = String(src);
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  if (API_ORIGIN && value.startsWith("/uploads")) {
    return `${API_ORIGIN}${value}`;
  }
  return value;
}

export function withUploadUrls<T>(value: T): T {
  if (typeof value === "string") return mediaUrl(value) as T;
  if (Array.isArray(value)) return value.map((item) => withUploadUrls(item)) as T;
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      next[key] = withUploadUrls(item);
    }
    return next as T;
  }
  return value;
}
