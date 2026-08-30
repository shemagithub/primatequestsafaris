import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import aboutFallback from "@/assets/rwanda-hills.jpg";
import teamFallback from "@/assets/trekkers-forest.jpg";
import { useSite } from "@/context/SiteContext";
import { breadcrumbJsonLd, graphJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";
import { useMemo } from "react";

export default function About() {
  const { settings } = useSite();
  const aboutImg = settings.about_image || aboutFallback;
  const teamImg = settings.team_image || teamFallback;
  const badgeWords = (settings.about_badge || "LEAVE NO TRACE").trim().split(/\s+/);
  const jsonLd = useMemo(
    () =>
      graphJsonLd(
        organizationJsonLd(settings),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ),
    [settings],
  );

  return (
    <PageTransition>
      <Seo
        title={pageMeta.about.title}
        description={pageMeta.about.description}
        path={pageMeta.about.path}
        image={aboutImg}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
      
      {/* Header */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)'
        }}></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif mb-4 sm:mb-6 leading-none">{settings.about_title}</h1>
              <p className="text-display text-xl sm:text-2xl md:text-3xl text-accent mb-6 sm:mb-8">{settings.about_subtitle}</p>
              <p className="text-base sm:text-xl text-white/80 font-sans leading-relaxed text-balance max-w-2xl mx-auto">
                {settings.about_intro}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <ScrollReveal direction="right">
              <div className="relative pl-8 sm:pl-12 md:pl-20">
                {/* Vertical Timeline */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/30">
                  <div className="absolute top-[10%] -left-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                  <div className="absolute top-[40%] -left-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                  <div className="absolute top-[70%] -left-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                  <div className="absolute bottom-[10%] -left-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                </div>
                
                {/* Decorative Quote */}
                <div className="hidden sm:block absolute -top-16 -left-4 text-display text-accent opacity-20 text-[10rem] leading-none select-none">"</div>

                <div className="space-y-8 relative z-10">
                  <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em]">{settings.about_roots_label || "Our Roots"}</h2>
                  <h3 className="text-4xl sm:text-5xl md:text-6xl text-display text-primary leading-tight">{settings.about_story_title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                    {settings.about_story_p1}
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                    {settings.about_story_p2}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative h-[380px] md:h-[700px] w-full group">
                <SeoImage src={aboutImg} alt="Rolling hills and farmland near Volcanoes National Park, Rwanda" className="w-full h-full object-cover shadow-2xl transition-transform duration-[2s] group-hover:scale-[1.02]" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary hidden md:block -z-10"></div>
                <div className="absolute inset-0 outline outline-[1px] outline-accent -outline-offset-12 z-10 pointer-events-none mix-blend-difference" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Conservation */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#143a18] text-white relative leaf-bg overflow-x-clip">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative h-[320px] sm:h-[420px] md:h-[600px] w-full">
                <SeoImage src={teamImg} alt="Safari guests trekking through rainforest with a local Rwanda guide" className="w-full h-full object-cover opacity-80 saturate-50" />
                <div className="absolute inset-0 border border-accent m-6 pointer-events-none"></div>
                
                <div className="absolute -top-6 -right-4 sm:-top-12 sm:-right-12 w-24 h-24 sm:w-32 sm:h-32 bg-accent rounded-full text-primary flex items-center justify-center font-bold text-[10px] sm:text-sm tracking-widest text-center shadow-2xl animate-[spin_10s_linear_infinite]">
                   <span className="absolute transform -rotate-45">{badgeWords[0] || "LEAVE"}</span>
                   <span className="absolute">{badgeWords[1] || "NO"}</span>
                   <span className="absolute transform rotate-45">{badgeWords[2] || "TRACE"}</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <div className="space-y-12">
                <div>
                  <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">{settings.conservation_label || "Conservation First"}</h2>
                  <h3 className="text-3xl sm:text-5xl text-display leading-tight">{settings.conservation_title}</h3>
                  <p className="text-white/80 text-lg leading-relaxed font-sans mt-6">
                    {settings.conservation_body}
                  </p>
                </div>
                
                <div className="space-y-8">
                  {[
                    [settings.about_stat_1_value || "$1.5k", settings.about_stat_1_text || "Every gorilla permit directly funds park protection and community projects."],
                    [settings.about_stat_2_value || "100%", settings.about_stat_2_text || "We employ local guides, porters, and drivers, ensuring tourism benefits our immediate communities."],
                    [settings.about_stat_3_value || "0", settings.about_stat_3_text || "We practice strict 'Leave No Trace' policies on all our expeditions, leaving the forest as we found it."],
                  ].map(([value, text], index) => (
                    <div key={value + index} className={`flex gap-4 sm:gap-6 items-center ${index < 2 ? "border-b border-white/10 pb-6" : ""}`}>
                      <div className="text-display text-3xl sm:text-5xl text-accent w-16 sm:w-24 shrink-0">{value}</div>
                      <p className="text-white/80 font-sans text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      </main>
      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}