import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { withUploadUrls } from "@/lib/media";
import { tours as fallbackTours, customTourOption, type Tour } from "@/data/tours";
import {
  defaultFaqs,
  defaultGallery,
  defaultPosts,
  defaultSettings,
  defaultTestimonials,
  normalizePost,
  normalizeTour,
} from "@/data/content";

type GalleryItem = { id: number; src: string; alt: string; category: string };
type Testimonial = { id: number; author: string; sub: string; text: string };
type Faq = { id: number; question: string; answer: string };
type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  gallery?: { src: string; caption?: string }[];
  category: string;
  author: string;
  publishedAt?: string | null;
};

type SiteContextValue = {
  settings: Record<string, string>;
  tours: Tour[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  posts: Post[];
  featuredTours: Tour[];
  tourOptions: { id: string; name: string; location: string; price: string; img: string }[];
};

const SiteContext = createContext<SiteContextValue | null>(null);

const DROPPED_SETTING_KEYS = ["about_partner_title", "about_partner_body", "about_partner_cta"] as const;

function mergeSettings(data: Record<string, string> = {}) {
  const merged = { ...defaultSettings, ...data };
  for (const key of DROPPED_SETTING_KEYS) delete merged[key];
  if (/Rwanda Development Board|RDB Partner|\bRDB\b/i.test(merged.conservation_body || "")) {
    merged.conservation_body = defaultSettings.conservation_body;
  }
  return merged;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [tours, setTours] = useState<Tour[]>(fallbackTours);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [faqs, setFaqs] = useState<Faq[]>(defaultFaqs);
  const [posts, setPosts] = useState<Post[]>(defaultPosts);

  useEffect(() => {
    api.settings().then((data) => setSettings(mergeSettings(withUploadUrls(data)))).catch(() => {});
    api.tours().then((data) => {
      if (Array.isArray(data) && data.length) setTours(data.map((tour) => withUploadUrls(normalizeTour(tour))));
    }).catch(() => {});
    api.gallery().then((data) => {
      if (Array.isArray(data) && data.length) setGallery(withUploadUrls(data));
    }).catch(() => {});
    api.testimonials().then((data) => {
      if (Array.isArray(data) && data.length) setTestimonials(data);
    }).catch(() => {});
    api.faqs().then((data) => {
      if (Array.isArray(data) && data.length) setFaqs(data);
    }).catch(() => {});
    api.posts().then((data) => {
      if (Array.isArray(data)) setPosts(data.map((post) => withUploadUrls(normalizePost(post))));
    }).catch(() => {});
  }, []);

  const value = useMemo<SiteContextValue>(() => {
    const featuredTours = tours.filter((tour) => tour.featured).slice(0, 2);
    return {
      settings,
      tours,
      gallery,
      testimonials,
      faqs,
      posts,
      featuredTours: featuredTours.length ? featuredTours : tours.slice(0, 2),
      tourOptions: [
        ...tours.map((tour) => ({
          id: tour.id,
          name: tour.title,
          location: tour.park,
          price: tour.price.replace("/person (Permit)", "").replace("/person", ""),
          img: tour.image,
        })),
        customTourOption,
      ],
    };
  }, [settings, tours, gallery, testimonials, faqs, posts]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
