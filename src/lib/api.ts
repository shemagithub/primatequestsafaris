import { API_ORIGIN } from "./media";

const BASE = API_ORIGIN;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export type SiteSettings = Record<string, string>;

export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  tour?: string;
  tours?: string[];
  dates: string;
  guests: number;
  budget: number;
  message: string;
  dietary?: string;
  source?: string;
  whatsappPref?: boolean;
};

export const api = {
  tours: () => request<any[]>("/api/tours"),
  tour: (slug: string) => request<any>(`/api/tours/${slug}`),
  gallery: () => request<any[]>("/api/gallery"),
  testimonials: () => request<any[]>("/api/testimonials"),
  faqs: () => request<any[]>("/api/faqs"),
  posts: () => request<any[]>("/api/posts"),
  post: (slug: string) => request<any>(`/api/posts/${slug}`),
  settings: () => request<SiteSettings>("/api/settings"),
  createInquiry: (payload: InquiryPayload) =>
    request("/api/inquiries", { method: "POST", body: JSON.stringify(payload) }),
  subscribe: (email: string) =>
    request<{ ok: boolean; alreadySubscribed?: boolean }>("/api/subscribers", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
