import { mediaUrl } from "./media";

export const SITE_NAME = "Primate Quest Safaris";
export const SITE_TAGLINE = "Gorilla trekking and wildlife safaris in Rwanda";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

const rawSiteUrl = String(import.meta.env.VITE_SITE_URL || "https://primatequestsafaris.com").replace(
  /\/$/,
  "",
);

export const SITE_URL = rawSiteUrl;

export function absoluteUrl(path = "/"): string {
  if (!path) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("//")) return `https:${path}`;
  if (path.startsWith("/uploads")) return mediaUrl(path) || `${SITE_URL}${path}`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateMeta(text: string, max = 158): string {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export const pageMeta = {
  home: {
    path: "/",
    title: "Gorilla Trekking & Wildlife Safaris in Rwanda",
    description:
      "Plan a Rwanda gorilla trek with Primate Quest Safaris. Local guides, Volcanoes National Park permits, chimpanzees in Nyungwe, and tailor-made wildlife itineraries from Kigali.",
  },
  tours: {
    path: "/tours",
    title: "Rwanda Safari Tours & Gorilla Trekking Expeditions",
    description:
      "Browse gorilla trekking, chimpanzee tracking, golden monkey walks, Akagera game drives, and custom Rwanda safaris with Primate Quest Safaris.",
  },
  about: {
    path: "/about",
    title: "About Primate Quest Safaris | Local Rwanda Experts",
    description:
      "Meet the Kigali-based team behind Primate Quest Safaris. Conservation-first gorilla trekking, unhurried wildlife encounters, and deep local knowledge of Rwanda.",
  },
  gallery: {
    path: "/gallery",
    title: "Rwanda Wildlife Gallery | Gorillas, Primates & Landscapes",
    description:
      "Photographs from gorilla trekking in Volcanoes National Park, chimpanzees in Nyungwe, Akagera safaris, and the hills of Rwanda.",
  },
  blog: {
    path: "/blog",
    title: "Rwanda Safari Journal | Gorilla Trekking Stories & Tips",
    description:
      "Guides and stories from Primate Quest Safaris: gorilla trekking prep, the best time to visit Rwanda, Nyungwe chimpanzees, and conservation.",
  },
  contact: {
    path: "/contact",
    title: "Plan Your Rwanda Gorilla Trek | Contact Us",
    description:
      "Inquire about gorilla permits, custom itineraries, and safari dates. Primate Quest Safaris is based in Kigali and replies by email and WhatsApp.",
  },
  notFound: {
    path: "/",
    title: "Page not found",
    description: "This page does not exist. Explore Rwanda gorilla trekking and safari expeditions with Primate Quest Safaris.",
  },
} as const;

type Settings = Record<string, string>;

function socialLinks(settings: Settings): string[] {
  return [settings.instagram, settings.facebook, settings.twitter].filter(
    (url) => url && url !== "#",
  );
}

export function organizationJsonLd(settings: Settings = {}) {
  const name = settings.site_name || SITE_NAME;
  const telephone = settings.phone || "";
  const email = settings.email || "info@primatequestsafaris.com";
  const sameAs = socialLinks(settings);

  return {
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name,
    url: SITE_URL,
    image: absoluteUrl(settings.logo || DEFAULT_OG_IMAGE),
    logo: absoluteUrl(settings.logo || "/favicon-512.png"),
    description: settings.footer_blurb || pageMeta.home.description,
    email,
    telephone,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_line1 || "Kigali Heights, KN 7 Rd",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.9441,
      longitude: 30.0619,
    },
    areaServed: [
      { "@type": "Country", name: "Rwanda" },
      { "@type": "AdministrativeArea", name: "Volcanoes National Park" },
      { "@type": "AdministrativeArea", name: "Nyungwe National Park" },
      { "@type": "AdministrativeArea", name: "Akagera National Park" },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function formatPostDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function articleJsonLd(post: {
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  image?: string;
  author?: string;
  publishedAt?: string | null;
}) {
  const iso = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: truncateMeta(post.excerpt || post.body || "", 160),
    url: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl(post.image || DEFAULT_OG_IMAGE),
    author: {
      "@type": "Organization",
      name: post.author || SITE_NAME,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
  };
}

export function tourJsonLd(tour: {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  park: string;
  duration: string;
  price: string;
  image: string;
}) {
  const amount = String(tour.price || "").replace(/[^0-9.]/g, "");
  return {
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.longDescription || tour.description,
    url: absoluteUrl(`/tours/${tour.id}`),
    image: absoluteUrl(tour.image || DEFAULT_OG_IMAGE),
    touristType: "Wildlife safari",
    itinerary: {
      "@type": "Place",
      name: tour.park,
      address: {
        "@type": "PostalAddress",
        addressCountry: "RW",
      },
    },
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(amount
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: amount,
            url: absoluteUrl(`/tours/${tour.id}`),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function graphJsonLd(...nodes: Array<Record<string, unknown> | null | undefined>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
