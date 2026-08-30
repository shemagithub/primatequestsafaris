import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import NotFound from "@/pages/not-found";
import { useSite } from "@/context/SiteContext";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  organizationJsonLd,
  tourJsonLd,
  truncateMeta,
} from "@/lib/seo";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Mountain,
  Tag,
  Users,
  X,
} from "lucide-react";

export default function TourDetail() {
  const [, params] = useRoute("/tours/:id");
  const { tours, settings } = useSite();
  const tour = tours.find((item) => item.id === (params?.id ?? ""));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const jsonLd = useMemo(
    () =>
      tour
        ? graphJsonLd(
            organizationJsonLd(settings),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Expeditions", path: "/tours" },
              { name: tour.title, path: `/tours/${tour.id}` },
            ]),
            tourJsonLd(tour),
          )
        : null,
    [settings, tour],
  );

  if (!tour) return <NotFound />;

  const relatedTours = tours.filter((t) => t.id !== tour.id).slice(0, 2);
  const secondaryImage = tour.gallery[1]?.src ?? tour.image;
  const accentImage = tour.gallery[2]?.src ?? tour.gallery[0]?.src ?? tour.image;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % tour.gallery.length : null));
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + tour.gallery.length) % tour.gallery.length : null,
    );

  return (
    <PageTransition>
      <Seo
        title={`${tour.title} in ${tour.park}`}
        description={truncateMeta(tour.longDescription || tour.description)}
        path={`/tours/${tour.id}`}
        image={tour.image}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">

      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[85vh] min-h-[480px] sm:min-h-[560px] flex items-end overflow-hidden">
        <SeoImage
          src={tour.image}
          alt={`${tour.title} in ${tour.park}, Rwanda`}
          priority
          className="absolute inset-0 w-full h-full object-cover animate-breath origin-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

        {/* Gold corner brackets */}
        <div className="absolute top-24 sm:top-28 left-4 sm:left-6 md:left-12 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-accent z-20 pointer-events-none" />
        <div className="absolute top-24 sm:top-28 right-4 sm:right-6 md:right-12 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-accent z-20 pointer-events-none" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 md:left-12 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-accent z-20 pointer-events-none" />
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 md:right-12 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-accent z-20 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 pb-10 sm:pb-16 pt-28 sm:pt-32">
          <ScrollReveal>
            <Link href="/tours">
              <span className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors cursor-pointer text-sm uppercase tracking-wider font-bold mb-8">
                <ArrowLeft size={16} /> All Expeditions
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {tour.featured && (
                <span className="bg-accent text-primary text-xs font-bold uppercase tracking-wider px-4 py-1">
                  Signature Experience
                </span>
              )}
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={14} className="text-accent" /> {tour.park}
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Clock size={14} className="text-accent" /> {tour.duration}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-display text-white mb-6 leading-tight">
              {tour.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="inline-flex items-center gap-2 bg-accent text-primary px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                <Tag size={14} /> {tour.price}
              </div>
              <Link href={`/contact?tour=${tour.id}`}>
                <span className="inline-flex items-center gap-3 bg-white text-primary px-6 sm:px-8 py-3 uppercase tracking-wider font-semibold hover:bg-accent transition-colors cursor-pointer text-sm group">
                  Book This Expedition
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview + Editorial Images */}
      <section className="py-16 sm:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <ScrollReveal className="lg:col-span-5">
              <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
                The Experience
              </h2>
              <p className="text-2xl md:text-3xl font-serif text-primary leading-relaxed mb-8 text-balance">
                {tour.description}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                {tour.longDescription}
              </p>
            </ScrollReveal>

            {/* Editorial image collage */}
            <ScrollReveal delay={0.15} direction="scale" className="lg:col-span-4">
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden group">
                  <SeoImage
                    src={tour.image}
                    alt={`${tour.title} — ${tour.park}`}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 outline outline-[1px] outline-accent -outline-offset-8 pointer-events-none mix-blend-difference" />
                </div>
                <div className="absolute -bottom-8 -right-4 md:-right-8 w-40 h-52 md:w-48 md:h-60 overflow-hidden shadow-2xl border-4 border-background z-10 group">
                  <SeoImage
                    src={secondaryImage}
                    alt={tour.gallery[1]?.caption || `${tour.title} highlight in ${tour.park}`}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 -z-10" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="lg:col-span-3">
              <div className="bg-card border border-border p-8 space-y-6 lg:sticky lg:top-32">
                <h3 className="text-xl font-serif text-primary">Quick Facts</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-primary">Duration</p>
                      <p className="text-muted-foreground">{tour.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mountain size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-primary">Difficulty</p>
                      <p className="text-muted-foreground">{tour.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-primary">Best Time</p>
                      <p className="text-muted-foreground">{tour.bestTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-primary">Group Size</p>
                      <p className="text-muted-foreground">{tour.groupSize}</p>
                    </div>
                  </div>
                </div>
                <Link href={`/contact?tour=${tour.id}`}>
                  <span className="block w-full text-center bg-primary text-white px-6 py-4 uppercase tracking-wider font-bold hover:bg-accent hover:text-primary transition-colors cursor-pointer text-sm">
                    Start Your Inquiry
                  </span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Cinematic full-bleed image strip */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[240px] sm:min-h-[320px] overflow-hidden">
        <SeoImage
          src={accentImage}
          alt={tour.gallery[2]?.caption || `${tour.title} landscape in Rwanda`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScrollReveal>
            <p className="text-white/90 text-display text-2xl md:text-4xl text-center max-w-2xl px-6 text-balance">
              {tour.gallery[0]?.caption}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-24 bg-primary text-white leaf-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <img src={tour.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Highlights
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl text-display mb-8 sm:mb-12">
              What Makes It Special
            </h3>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {tour.highlights.map((item, i) => (
              <ScrollReveal key={item} delay={i * 0.08}>
                <div className="flex items-start gap-4 p-6 border border-white/10 hover:border-accent/50 transition-colors backdrop-blur-sm bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Check size={16} className="text-accent" />
                  </div>
                  <p className="text-white/90 font-sans leading-relaxed">{item}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — editorial mosaic */}
      {tour.gallery.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#f5f0e8] relative overflow-hidden">
          <div className="hidden md:block absolute top-20 right-10 text-[12rem] text-display text-primary opacity-[0.04] select-none pointer-events-none leading-none">
            03
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <ScrollReveal>
              <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
                Gallery
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl text-display text-primary mb-4">
                A Glimpse of the Journey
              </h3>
              <p className="text-muted-foreground font-sans mb-12 max-w-xl">
                Click any image to view full size. Every moment captured in Rwanda's wild heart.
              </p>
            </ScrollReveal>

            {/* Mosaic grid */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[220px]">
              {tour.gallery.map((photo, i) => {
                const layouts = [
                  "col-span-2 md:col-span-7 md:row-span-2",
                  "col-span-1 md:col-span-5",
                  "col-span-1 md:col-span-5",
                  "col-span-1 md:col-span-4",
                  "col-span-1 md:col-span-4",
                  "col-span-2 md:col-span-4",
                ];
                const layout = layouts[i % layouts.length];

                return (
                  <ScrollReveal
                    key={photo.src + i}
                    delay={i * 0.07}
                    direction="scale"
                    className={layout}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="group relative w-full h-full overflow-hidden cursor-pointer bg-primary/5 block"
                    >
                      <SeoImage
                        src={photo.src}
                        alt={photo.caption || `${tour.title} photo`}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white font-serif text-sm md:text-base leading-snug">
                          {photo.caption}
                        </p>
                        <p className="text-accent text-[10px] uppercase tracking-widest font-bold mt-2">
                          View Full Size
                        </p>
                      </div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Itinerary with alternating images */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Itinerary
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl text-display text-primary mb-10 sm:mb-16">
              Day by Day
            </h3>
          </ScrollReveal>

          <div className="space-y-16 md:space-y-24 max-w-5xl mx-auto">
            {tour.itinerary.map((day, i) => {
              const dayImage = tour.gallery.length
                ? tour.gallery[i % tour.gallery.length]
                : undefined;
              const imageRight = i % 2 === 0;

              return (
                <ScrollReveal key={day.day} delay={i * 0.08}>
                  <div
                    className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${imageRight ? "" : "md:[direction:rtl]"}`}
                  >
                    <div className={imageRight ? "" : "md:[direction:ltr]"}>
                      <div className="relative overflow-hidden group aspect-[4/3] md:aspect-[5/4]">
                        {dayImage ? (
                          <SeoImage
                            src={dayImage.src}
                            alt={dayImage.caption || `Day ${day.day}: ${day.title}`}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                          />
                        ) : null}
                        <div className="absolute inset-0 outline outline-[1px] outline-accent -outline-offset-6 pointer-events-none opacity-60" />
                        <div className="absolute top-4 left-4 bg-accent text-primary text-display text-2xl px-3 py-1 font-bold">
                          {String(day.day).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                    <div className={imageRight ? "" : "md:[direction:ltr]"}>
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/40" />
                        <p className="text-accent text-display text-3xl mb-2">
                          Day {String(day.day).padStart(2, "0")}
                        </p>
                        <h4 className="text-2xl md:text-3xl font-serif text-primary mb-4">
                          {day.title}
                        </h4>
                        <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                          {day.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inclusions / Exclusions */}
      <section className="py-16 sm:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <ScrollReveal>
              <h3 className="text-3xl text-display text-primary mb-8">What's Included</h3>
              <ul className="space-y-4">
                {tour.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={18} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <h3 className="text-3xl text-display text-primary mb-8">Not Included</h3>
              <ul className="space-y-4">
                {tour.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X size={18} className="text-muted-foreground/50 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Booking CTA with background image */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <img
          src={tour.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="absolute inset-0 leaf-bg opacity-30" />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl text-display text-white mb-6">Ready to Go?</h2>
            <p className="text-white/80 font-sans mb-4 text-lg leading-relaxed text-balance">
              {tour.title} starts at{" "}
              <span className="text-accent font-bold">{tour.price}</span>. Tell us your
              preferred dates and group size — our experts will craft your perfect
              itinerary.
            </p>
            <p className="text-white/60 font-sans mb-12 text-sm">
              Gorilla permits sell out 6–12 months in advance. We recommend booking early.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/contact?tour=${tour.id}`}>
                <span className="inline-block px-10 py-5 bg-accent text-primary font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer text-sm">
                  Book This Expedition
                </span>
              </Link>
              <Link href="/tours">
                <span className="inline-block px-10 py-5 border border-white/30 text-white font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition-colors cursor-pointer text-sm">
                  View All Tours
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal>
              <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
                You May Also Like
              </h2>
              <h3 className="text-4xl text-display text-primary mb-12">More Expeditions</h3>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedTours.map((related, i) => (
                <ScrollReveal key={related.id} delay={i * 0.1} direction="scale">
                  <Link href={`/tours/${related.id}`}>
                    <div className="group relative h-[280px] sm:h-[420px] overflow-hidden bg-black cursor-pointer">
                      <SeoImage
                        src={related.image}
                        alt={`${related.title} in ${related.park}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[2s] group-hover:scale-110 group-hover:opacity-50"
                      />
                      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent z-20 pointer-events-none" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-2">
                          {related.duration} · {related.park}
                        </p>
                        <h4 className="text-2xl sm:text-3xl text-display text-white group-hover:text-accent transition-colors mb-2">
                          {related.title}
                        </h4>
                        <p className="text-white/70 font-sans text-sm line-clamp-2 mb-4">
                          {related.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                          View Details{" "}
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-2 transition-transform"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 h-1 bg-accent w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-accent transition-colors z-10"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {tour.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-4 md:left-8 text-white/70 hover:text-accent transition-colors z-10 min-h-11 min-w-11 inline-flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-4 md:right-8 text-white/70 hover:text-accent transition-colors z-10 min-h-11 min-w-11 inline-flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SeoImage
                src={tour.gallery[lightboxIndex].src}
                alt={tour.gallery[lightboxIndex].caption || tour.title}
                className="w-full h-full object-contain max-h-[75vh] mx-auto"
              />
              <div className="mt-4 sm:absolute sm:-bottom-12 left-0 right-0 text-center">
                <p className="text-white font-serif text-base sm:text-lg">
                  {tour.gallery[lightboxIndex].caption}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-2">
                  {lightboxIndex + 1} / {tour.gallery.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>

      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}
