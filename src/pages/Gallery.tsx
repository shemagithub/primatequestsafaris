import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { breadcrumbJsonLd, graphJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";

type Category = 'All' | 'Gorillas' | 'Primates' | 'Landscapes' | 'Safari';

const categories: Category[] = ['All', 'Gorillas', 'Primates', 'Landscapes', 'Safari'];

export default function Gallery() {
  const { gallery, settings } = useSite();
  const photos = gallery;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const jsonLd = useMemo(
    () =>
      graphJsonLd(
        organizationJsonLd(settings),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]),
      ),
    [settings],
  );

  const filteredPhotos = photos.filter(p => activeCategory === 'All' || p.category === activeCategory);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <PageTransition>
      <Seo
        title={pageMeta.gallery.title}
        description={pageMeta.gallery.description}
        path={pageMeta.gallery.path}
        image={photos[0]?.src}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
      
      {/* Header */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-12 sm:pb-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-6xl md:text-8xl text-display mb-4 sm:mb-6">Visual Journey</h1>
            <p className="text-base sm:text-xl text-white/80 font-sans">
              Glimpses of the extraordinary moments awaiting you in Rwanda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-primary/95 sticky top-[60px] sm:top-[72px] z-40 border-b border-accent/20 backdrop-blur-md">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-start sm:justify-center gap-2 sm:gap-4 py-3 sm:py-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors min-h-10 ${
                  activeCategory === cat 
                    ? "bg-accent text-primary" 
                    : "bg-transparent text-white/60 hover:text-white border border-white/20 hover:border-white/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-10 sm:py-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    key={photo.src + photo.id}
                    className="relative group cursor-pointer overflow-hidden bg-card break-inside-avoid shadow-md"
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <SeoImage
                      src={photo.src}
                      alt={photo.alt || `Wildlife photograph from Rwanda — ${photo.category}`}
                      className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    
                    {/* Caption Bar */}
                    <div className="absolute bottom-0 left-0 w-full bg-primary/95 text-white p-3 sm:p-4 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 border-t border-accent">
                      <p className="text-display text-lg sm:text-2xl text-accent">{photo.alt}</p>
                      <p className="text-xs uppercase tracking-widest font-sans mt-1 sm:mt-2 opacity-70">{photo.category}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-3 sm:p-4 md:p-12 backdrop-blur-xl"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <button 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full min-h-11 min-w-11 inline-flex items-center justify-center"
              onClick={() => setSelectedPhotoIndex(null)}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 bg-black/50 p-2 sm:p-4 rounded-full min-h-11 min-w-11 inline-flex items-center justify-center"
              onClick={prevPhoto}
            >
              <ChevronLeft size={36} />
            </button>
            
            <button 
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 bg-black/50 p-2 sm:p-4 rounded-full min-h-11 min-w-11 inline-flex items-center justify-center"
              onClick={nextPhoto}
            >
              <ChevronRight size={36} />
            </button>

            <motion.div
              key={selectedPhotoIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-full max-w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <SeoImage
                src={filteredPhotos[selectedPhotoIndex].src}
                alt={filteredPhotos[selectedPhotoIndex].alt || "Rwanda wildlife photograph"}
                className="max-h-[70vh] sm:max-h-[85vh] max-w-full object-contain shadow-2xl outline outline-[1px] outline-accent/20"
              />
              <div className="mt-4 sm:absolute sm:bottom-[-40px] text-center w-full">
                <p className="text-display text-xl sm:text-3xl text-accent">{filteredPhotos[selectedPhotoIndex].alt}</p>
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