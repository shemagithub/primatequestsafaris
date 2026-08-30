import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import { useSite } from "@/context/SiteContext";
import { breadcrumbJsonLd, graphJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";
import { ArrowRight, Clock, MapPin, Tag } from "lucide-react";
import { useMemo } from "react";

export default function Tours() {
  const { tours, settings } = useSite();
  const jsonLd = useMemo(
    () =>
      graphJsonLd(
        organizationJsonLd(settings),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Expeditions", path: "/tours" },
        ]),
      ),
    [settings],
  );

  return (
    <PageTransition>
      <Seo
        title={pageMeta.tours.title}
        description={pageMeta.tours.description}
        path={pageMeta.tours.path}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
      
      {/* Header */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 bg-primary text-white overflow-hidden">
        {/* CSS Diagonal Stripe Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)'
        }}></div>
        
        {/* Background Watermark */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,15vw,16rem)] font-serif tracking-widest text-white opacity-[0.04] whitespace-nowrap pointer-events-none z-0">
          EXPEDITIONS
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-6xl md:text-8xl text-display mb-6 sm:mb-8">Our Expeditions</h1>
              <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
                <div className="h-px w-12 sm:w-24 bg-accent" />
                <div className="w-3 h-3 rotate-45 bg-accent" />
                <div className="h-px w-12 sm:w-24 bg-accent" />
              </div>
              <p className="text-base sm:text-xl text-white/80 font-sans leading-relaxed text-balance">
                Expertly crafted itineraries designed to bring you face-to-face with Africa's most extraordinary wildlife. Every detail handled.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tour Grid */}
      <section className="py-12 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {tours.map((tour, index) => (
              <ScrollReveal key={tour.id} delay={index * 0.1} direction="scale">
                <Link href={`/tours/${tour.id}`}>
                  <div className="group bg-card h-auto flex flex-col hover:border-l-4 hover:border-l-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative cursor-pointer">
                    
                    {/* Image Area */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                      <SeoImage
                        src={tour.image}
                        alt={`${tour.title} in ${tour.park}, Rwanda`}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.05]"
                      />
                      
                      {/* Editorial Tour Number */}
                      <div className="absolute top-0 left-0 bg-background/90 text-accent text-display text-4xl px-4 py-2 border-b border-r border-border">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Tape Label Signature Badge */}
                      {tour.featured && (
                        <div className="absolute top-4 -right-12 bg-accent text-primary text-xs font-bold uppercase tracking-wider px-12 py-1 rotate-45 shadow-md">
                          Signature
                        </div>
                      )}
                      
                      {/* Price Pill */}
                      <div className="absolute bottom-4 left-4 bg-primary text-accent text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                        {tour.price}
                      </div>
                    </div>

                    {/* Text Area */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow bg-card">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-accent" /> {tour.duration}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {tour.park.split(" ")[0]}</span>
                      </div>
                      
                      <h3 className="text-2xl font-serif text-primary mb-3 group-hover:text-accent transition-colors">{tour.title}</h3>
                      <p className="text-muted-foreground font-sans mb-6 flex-grow line-clamp-3 text-sm">{tour.description}</p>
                      
                      <div className="mt-auto flex justify-end">
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-colors group/btn">
                          <ArrowRight size={20} className="group-hover/btn:-rotate-45 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 sm:py-24 bg-primary text-white border-t-4 border-accent relative overflow-hidden leaf-bg">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <ScrollReveal>
            <Tag size={48} className="text-accent mx-auto mb-8" />
            <h2 className="text-3xl sm:text-5xl text-display mb-6 sm:mb-8">Need a custom itinerary?</h2>
            <p className="text-white/80 font-sans mb-12 text-lg leading-relaxed text-balance">
              We specialize in bespoke safaris tailored to your exact preferences, schedule, and group size. Let our experts design your perfect African journey.
            </p>
            <Link href="/contact">
              <div className="inline-block px-10 py-5 bg-white text-primary font-bold uppercase tracking-wider hover:bg-accent hover:text-primary transition-colors cursor-pointer text-sm">
                Request Custom Safari
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      </main>
      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}
