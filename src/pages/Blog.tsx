import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import { useSite } from "@/context/SiteContext";
import { breadcrumbJsonLd, formatPostDate, graphJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

export default function Blog() {
  const { posts, settings } = useSite();
  const jsonLd = useMemo(
    () =>
      graphJsonLd(
        organizationJsonLd(settings),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ),
    [settings],
  );

  return (
    <PageTransition>
      <Seo
        title={pageMeta.blog.title}
        description={pageMeta.blog.description}
        path={pageMeta.blog.path}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
        <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 bg-primary text-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)",
            }}
          />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,15vw,16rem)] font-serif tracking-widest text-white opacity-[0.04] whitespace-nowrap pointer-events-none z-0">
            JOURNAL
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-6xl md:text-8xl text-display mb-6 sm:mb-8">The Journal</h1>
                <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
                  <div className="h-px w-12 sm:w-24 bg-accent" />
                  <div className="w-3 h-3 rotate-45 bg-accent" />
                  <div className="h-px w-12 sm:w-24 bg-accent" />
                </div>
                <p className="text-base sm:text-xl text-white/80 font-sans leading-relaxed text-balance">
                  Stories from the forest: gorilla trekking, chimpanzees, and how we travel in Rwanda.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-12 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            {posts.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {posts.map((post, index) => (
                  <ScrollReveal key={post.slug} delay={index * 0.08} direction="scale">
                    <Link href={`/blog/${post.slug}`}>
                      <article
                        className={`group bg-card h-auto flex flex-col hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500 relative cursor-pointer overflow-hidden ${
                          index === 0 ? "md:col-span-2 lg:col-span-3 md:grid md:grid-cols-2 md:min-h-[420px]" : ""
                        }`}
                      >
                        <div className={`relative overflow-hidden ${index === 0 ? "h-64 sm:h-80 md:h-full" : "h-56 sm:h-64"}`}>
                          <SeoImage
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-70" />
                          <div className="absolute bottom-4 left-4 bg-accent text-primary text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5">
                            {post.category}
                          </div>
                        </div>
                        <div className={`p-6 sm:p-8 flex flex-col flex-grow ${index === 0 ? "md:justify-center md:p-12" : ""}`}>
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                            {formatPostDate(post.publishedAt) || "Journal"}
                          </p>
                          <h2 className={`font-serif text-primary mb-3 group-hover:text-accent transition-colors text-balance ${index === 0 ? "text-3xl sm:text-5xl" : "text-2xl"}`}>
                            {post.title}
                          </h2>
                          <p className={`text-muted-foreground font-sans mb-6 flex-grow ${index === 0 ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
                            {post.excerpt}
                          </p>
                          {index === 0 && (post.gallery || []).filter((item) => item.src && item.src !== post.image).length ? (
                            <div className="flex gap-2 mb-6">
                              {(post.gallery || [])
                                .filter((item) => item.src && item.src !== post.image)
                                .slice(0, 3)
                                .map((item) => (
                                  <div key={item.src} className="w-16 h-14 overflow-hidden">
                                    <SeoImage src={item.src} alt={item.caption || post.title} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                            </div>
                          ) : null}
                          <div className="mt-auto flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            <span>Read the story</span>
                            <span className="h-px flex-1 max-w-12 bg-accent" />
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground font-sans">Stories will appear here soon.</p>
            )}
          </div>
        </section>
      </main>
      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}
