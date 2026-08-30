import type { Tour } from "./tours";
import heroGorilla from "@/assets/hero-gorilla.jpg";
import rwandaHills from "@/assets/rwanda-hills.jpg";
import chimpNyungwe from "@/assets/chimp-nyungwe.jpg";
import heroVolcanoes from "@/assets/hero-volcanoes.jpg";
import gorillaEyes from "@/assets/gorilla-eyes.jpg";
import goldenMonkey from "@/assets/golden-monkey.jpg";
import trekkersForest from "@/assets/trekkers-forest.jpg";
import rwandaSafari from "@/assets/rwanda-safari.jpg";
import gorillaFamily from "@/assets/gorilla-family.jpg";
import safariLodge from "@/assets/safari-lodge.jpg";
import kigaliSkyline from "@/assets/kigali-skyline.jpg";
import birding from "@/assets/birding.jpg";

export const defaultSettings: Record<string, string> = {
  site_name: "Primates Quest Safaris",
  tagline: "Where the mist parts for those who seek.",
  phone: "+250 788 000 000",
  email: "info@primatequestsafaris.com",
  email_bookings: "bookings@primatequestsafaris.com",
  address_line1: "Kigali Heights, KN 7 Rd",
  address_line2: "P.O Box 1234",
  address_city: "Kigali, Rwanda",
  whatsapp: "250788000000",
  instagram: "#",
  facebook: "#",
  twitter: "#",
  footer_blurb:
    "Premium gorilla and chimpanzee trekking experiences in Rwanda's most spectacular national parks. Where wilderness becomes unforgettable.",
  hero_eyebrow: "Rwanda's Premier Wildlife Experience",
  hero_title: "Lock Eyes With\nThe Wild",
  hero_cta: "Explore Our Tours",
  hero_image: heroGorilla,
  intro_label: "Our Philosophy",
  intro_title: "Where ancient rainforest meets volcano skylines.",
  intro_body:
    "Primates Quest Safaris is built for travelers who want to experience nature profoundly. We believe in unhurried, exclusive encounters with Rwanda's most majestic creatures. Stand in the mist of the Virunga peaks and listen to the silence before a silverback emerges.",
  intro_image: chimpNyungwe,
  featured_secondary_image: safariLodge,
  years_experience: "12",
  permit_success: "100",
  happy_guests: "4500",
  national_parks: "4",
  cta_title: "Ready for the wild?",
  cta_body: "Permits are limited and book up months in advance. Start planning your Rwandan adventure today.",
  about_title: "Beyond The Safari",
  about_subtitle: "Crafting legends in the mist.",
  about_intro:
    "Primates Quest Safaris was born from a deep love for Rwanda's wilderness and a commitment to protecting its future. We don't just guide tours; we share our home.",
  about_story_title: "Born in the land of a thousand hills.",
  about_story_p1:
    "Founded by native Rwandans who grew up in the shadows of the Virunga volcanoes, our company is built on an intimate knowledge of the land. We've spent decades walking these forests, studying animal behavior, and building relationships with local communities.",
  about_story_p2:
    "To us, luxury isn't just about fine lodges—it's about exclusive access, seamless logistics, and the peace of mind that comes from traveling with true local experts.",
  about_image: rwandaHills,
  about_roots_label: "Our Roots",
  conservation_label: "Conservation First",
  conservation_title: "Protecting what we love.",
  conservation_body:
    "The survival of the mountain gorilla is one of the world's greatest conservation success stories. We dedicate a percentage of our profits to grassroots conservation efforts that protect forests, wildlife, and the communities who live beside them.",
  about_stat_1_value: "$1.5k",
  about_stat_1_text: "Every gorilla permit directly funds park protection and community projects.",
  about_stat_2_value: "100%",
  about_stat_2_text: "We employ local guides, porters, and drivers, ensuring tourism benefits our immediate communities.",
  about_stat_3_value: "0",
  about_stat_3_text: "We practice strict 'Leave No Trace' policies on all our expeditions, leaving the forest as we found it.",
  about_badge: "LEAVE NO TRACE",
  team_image: trekkersForest,
  logo: "",
};

export const defaultTestimonials = [
  {
    id: 1,
    author: "Sarah & James Mitchell",
    sub: "Gorilla Trekking & Nyungwe Combo, 2023",
    text: "Looking into the eyes of a silverback in the wild changes you. Primates Quest orchestrated every detail perfectly. It wasn't just a tour; it was a profound life experience.",
  },
  {
    id: 2,
    author: "David Arquette",
    sub: "Rwanda Grand Safari, 2024",
    text: "From the luxury lodge to the moment the mist cleared in the Virungas, every second felt handcrafted. The guides were exceptionally knowledgeable.",
  },
  {
    id: 3,
    author: "Elena & Marco Ricci",
    sub: "East Africa Combo, 2023",
    text: "We were worried about the logistics, but they handled absolutely everything. A truly premium service that let us just focus on the magic of the rainforest.",
  },
];

export const defaultFaqs = [
  { id: 1, question: "When is the best time to visit Rwanda?", answer: "March–June and Sep–Dec, avoiding the long rains." },
  { id: 2, question: "How far in advance should I book?", answer: "Gorilla permits sell 6–12 months ahead; book early." },
  { id: 3, question: "Is gorilla trekking physically demanding?", answer: "Moderate difficulty, 2–6 hours of trekking at altitude." },
  { id: 4, question: "What's included in the permit price?", answer: "Park entry, ranger guide, 1 hour with gorillas; accommodation separate." },
];

export const defaultGallery = [
  { id: 1, src: heroGorilla, alt: "Silverback Gorilla in the Mist", category: "Gorillas" },
  { id: 2, src: rwandaHills, alt: "Rolling Hills of Rwanda", category: "Landscapes" },
  { id: 3, src: chimpNyungwe, alt: "Chimpanzee in Nyungwe Canopy", category: "Primates" },
  { id: 4, src: heroVolcanoes, alt: "Virunga Volcanoes Skyline", category: "Landscapes" },
  { id: 5, src: gorillaEyes, alt: "The Stare of a Silverback", category: "Gorillas" },
  { id: 6, src: goldenMonkey, alt: "Golden Monkey in Bamboo", category: "Primates" },
  { id: 7, src: trekkersForest, alt: "Trekkers Navigating the Forest", category: "Safari" },
  { id: 8, src: rwandaSafari, alt: "Safari Vehicle in Akagera", category: "Safari" },
  { id: 9, src: gorillaFamily, alt: "Gorilla Family Resting", category: "Gorillas" },
  { id: 10, src: safariLodge, alt: "Luxury Safari Lodge", category: "Safari" },
  { id: 11, src: kigaliSkyline, alt: "Kigali Skyline at Dusk", category: "Landscapes" },
  { id: 12, src: birding, alt: "Endemic Bird Species", category: "Safari" },
];

export function normalizeTour(raw: any): Tour {
  return {
    id: raw.id || raw.slug,
    title: raw.title,
    park: raw.park,
    duration: raw.duration,
    price: raw.price,
    description: raw.description,
    longDescription: raw.longDescription || raw.long_description || "",
    highlights: raw.highlights || [],
    itinerary: raw.itinerary || [],
    inclusions: raw.inclusions || [],
    exclusions: raw.exclusions || [],
    difficulty: raw.difficulty,
    bestTime: raw.bestTime || raw.best_time || "",
    groupSize: raw.groupSize || raw.group_size || "",
    image: raw.image,
    gallery: raw.gallery || [],
    featured: Boolean(raw.featured),
  };
}

export type Post = {
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

export const defaultPosts: Post[] = [
  {
    id: "how-to-prepare-for-gorilla-trekking",
    slug: "how-to-prepare-for-gorilla-trekking",
    title: "How to prepare for a gorilla trek in Rwanda",
    excerpt:
      "Permits, fitness, packing, and park etiquette — what actually matters before you meet a silverback in Volcanoes National Park.",
    body: "A gorilla trek is the centrepiece of most Rwanda safaris, and a little preparation makes the day smoother.\n\nBook the permit first. Rwanda gorilla permits are limited and often sell out 6–12 months ahead for peak months.",
    image: heroGorilla,
    category: "Gorillas",
    author: "Primates Quest Safaris",
    publishedAt: "2026-06-12",
  },
];

export function normalizePost(raw: any): Post {
  return {
    id: raw.id || raw.slug,
    slug: raw.slug || raw.id,
    title: raw.title,
    excerpt: raw.excerpt || "",
    body: raw.body || "",
    image: raw.image || "",
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    category: raw.category || "Safari",
    author: raw.author || "Primates Quest Safaris",
    publishedAt: raw.publishedAt || raw.published_at || raw.createdAt || null,
  };
}
