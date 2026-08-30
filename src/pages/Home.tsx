import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import { Link } from "wouter";
import { ArrowRight, Star, Shield, Leaf, Clock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { formatPostDate, graphJsonLd, organizationJsonLd, pageMeta, websiteJsonLd } from "@/lib/seo";
import heroFallback from "@/assets/hero-gorilla.jpg";
import introFallback from "@/assets/chimp-nyungwe.jpg";
import featuredFallback from "@/assets/safari-lodge.jpg";

export default function Home() {
  const { settings, featuredTours, testimonials, posts } = useSite();
  const heroImg = settings.hero_image || heroFallback;
  const introImg = settings.intro_image || introFallback;
  const secondFeaturedImg = featuredTours[1]?.image || settings.featured_secondary_image || featuredFallback;
  const heroTitle = (settings.hero_title || "Lock Eyes With\nThe Wild").split("\n");
  const [activeQuote, setActiveQuote] = useState(0);
  const jsonLd = useMemo(
    () => graphJsonLd(organizationJsonLd(settings), websiteJsonLd()),
    [settings],
  );

  return (
    <PageTransition>
      <Seo
        title={pageMeta.home.title}
        description={pageMeta.home.description}
        path={pageMeta.home.path}
        image={heroImg}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
      
      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[520px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">
        <SeoImage
          src={heroImg}
          alt="Mountain gorilla in Volcanoes National Park, Rwanda"
          priority
          className="absolute inset-0 w-full h-full object-cover animate-breath origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/95" />
        
        {/* Volcanic Silhouette Parallax Layer */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none text-primary">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-[15vh] md:h-[25vh] fill-current opacity-95">
            <path d="M0,100 Q360,0 720,80 Q1080,160 1440,60 L1440,200 L0,200 Z" />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-accent rounded-full opacity-10"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 80 + 10 + '%',
              }}
              animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-accent text-display tracking-[0.2em] sm:tracking-[0.4em] text-base sm:text-xl md:text-2xl mb-4 sm:mb-6"
          >
            {settings.hero_eyebrow}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.75rem] sm:text-6xl md:text-8xl lg:text-9xl text-display text-white mb-6 sm:mb-8 leading-[0.95] text-balance"
          >
            {heroTitle.map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/tours">
              <div className="inline-flex items-center gap-3 bg-accent text-primary px-6 sm:px-8 py-3.5 sm:py-4 uppercase tracking-wider font-semibold hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer relative overflow-hidden group text-sm sm:text-base">
                <span className="relative z-10 flex items-center gap-3">{settings.hero_cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out_infinite] z-0" />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-10 text-accent/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-16 sm:py-24 md:py-40 bg-background relative overflow-hidden">
        <div className="hidden md:block absolute top-10 right-10 text-[20rem] text-display text-foreground opacity-[0.03] select-none pointer-events-none leading-none z-0">
          01
        </div>
        
        {/* Floating leaves */}
        <svg className="absolute top-1/4 left-10 w-12 h-12 text-primary opacity-5 animate-float pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C12,2 4,6 4,14C4,18.4 7.6,22 12,22C16.4,22 20,18.4 20,14C20,6 12,2 12,2ZM11,19.9C7.7,19.4 5,16.5 5,14C5,8.9 9.8,4.7 11.5,3.4L11,19.9ZM13,19.9L12.5,3.4C14.2,4.7 19,8.9 19,14C19,16.5 16.3,19.4 13,19.9Z" />
        </svg>
        <svg className="absolute bottom-1/4 right-20 w-16 h-16 text-primary opacity-5 animate-float pointer-events-none" style={{ animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C12,2 4,6 4,14C4,18.4 7.6,22 12,22C16.4,22 20,18.4 20,14C20,6 12,2 12,2ZM11,19.9C7.7,19.4 5,16.5 5,14C5,8.9 9.8,4.7 11.5,3.4L11,19.9ZM13,19.9L12.5,3.4C14.2,4.7 19,8.9 19,14C19,16.5 16.3,19.4 13,19.9Z" />
        </svg>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-24 items-center">
            <ScrollReveal direction="scale" blur>
              <div className="relative aspect-[4/5] p-3 group">
                <div className="absolute inset-0 outline outline-[1px] outline-accent -outline-offset-12 z-10 pointer-events-none mix-blend-difference" />
                <SeoImage
                  src={introImg}
                  alt="Chimpanzee in the rainforest canopy of Nyungwe National Park, Rwanda"
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <div className="max-w-xl pl-5 sm:pl-6 relative">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-accent/40" />
                
                <h2 className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">{settings.intro_label}</h2>
                <h3 className="text-4xl sm:text-5xl md:text-6xl text-display text-foreground leading-tight mb-6 sm:mb-8 text-balance">
                  {settings.intro_title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-sans">
                  {settings.intro_body}
                </p>
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="text-2xl font-serif text-primary mb-2">Exclusive</h4>
                    <p className="text-sm text-muted-foreground">Small group sizes for intimate encounters.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif text-primary mb-2">Expert</h4>
                    <p className="text-sm text-muted-foreground">Guided by local conservation specialists.</p>
                  </div>
                </div>
                <Link href="/about">
                  <div className="inline-block border-b border-accent text-primary font-bold uppercase tracking-wider pb-1 hover:text-accent transition-colors cursor-pointer text-sm">
                    Discover Our Story
                  </div>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Tours Preview */}
      <section className="py-16 sm:py-24 md:py-32 bg-primary text-white relative overflow-hidden leaf-bg">
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] text-display text-white opacity-[0.02] select-none pointer-events-none leading-none z-0">
          02
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 md:mb-20 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">Signature Experiences</h2>
                <h3 className="text-4xl sm:text-5xl md:text-6xl text-display leading-tight">Extraordinary Journeys</h3>
              </div>
              <Link href="/tours">
                <div className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors cursor-pointer uppercase tracking-wider font-semibold text-sm group">
                  View All Tours <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredTours.map((tour, index) => (
            <ScrollReveal key={tour.id} direction="scale" delay={index === 0 ? 0.1 : 0.3}>
              <Link href={`/tours/${tour.id}`}>
                <div className="group relative h-[380px] sm:h-[480px] md:h-[600px] overflow-hidden bg-black cursor-pointer">
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent z-20 pointer-events-none" />
                  
                  <SeoImage src={index === 1 && !tour.image ? secondFeaturedImg : tour.image} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-110 group-hover:opacity-40" alt={`${tour.title} in ${tour.park}`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                    <h4 className="text-2xl sm:text-4xl text-display mb-3 text-white group-hover:text-accent transition-colors">{tour.title}</h4>
                    <p className="text-white/80 font-sans mb-8 line-clamp-2 text-lg">{tour.description}</p>
                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-accent relative w-max">
                      <span>Explore</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
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

      {/* Counters Section */}
      <section className="py-16 sm:py-24 md:py-28 bg-accent text-primary relative overflow-hidden clip-diagonal leaf-bg">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 text-center md:divide-x divide-primary/20">
            <ScrollReveal delay={0.1}>
              <div className="text-4xl sm:text-6xl md:text-7xl text-display mb-2 sm:mb-3"><AnimatedCounter end={Number(settings.years_experience) || 12} suffix="+" /></div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-80">Years Experience</div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="text-4xl sm:text-6xl md:text-7xl text-display mb-2 sm:mb-3"><AnimatedCounter end={Number(settings.permit_success) || 100} suffix="%" /></div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-80">Permit Success</div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="text-4xl sm:text-6xl md:text-7xl text-display mb-2 sm:mb-3"><AnimatedCounter end={Number(settings.happy_guests) || 4500} suffix="+" /></div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-80">Happy Guests</div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="text-4xl sm:text-6xl md:text-7xl text-display mb-2 sm:mb-3"><AnimatedCounter end={Number(settings.national_parks) || 4} /></div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-80">National Parks</div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Us / Trust Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <h2 className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">Why Choose Us</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl text-display text-foreground">The Primates Quest Standard</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px border-t-2 border-dashed border-border z-0" />
            
            <ScrollReveal direction="up" delay={0.1} className="text-center relative z-10 group">
              <div className="bg-card border border-transparent group-hover:border-b-accent transition-all duration-300 group-hover:-translate-y-3 p-8 h-full">
                <div className="w-24 h-24 mx-auto bg-primary text-accent clip-hexagon flex items-center justify-center mb-8 shadow-lg">
                  <Shield size={36} />
                </div>
                <h4 className="text-2xl font-serif text-primary mb-4">Local Expertise</h4>
                <p className="text-muted-foreground leading-relaxed">Born and raised in Rwanda. We know the terrain, the rangers, and the wildlife intimately.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2} className="text-center relative z-10 group">
              <div className="bg-card border border-transparent group-hover:border-b-accent transition-all duration-300 group-hover:-translate-y-3 p-8 h-full">
                <div className="w-24 h-24 mx-auto bg-primary text-accent clip-hexagon flex items-center justify-center mb-8 shadow-lg">
                  <Leaf size={36} />
                </div>
                <h4 className="text-2xl font-serif text-primary mb-4">Conservation First</h4>
                <p className="text-muted-foreground leading-relaxed">A portion of every booking goes directly to community and gorilla conservation projects.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3} className="text-center relative z-10 group">
              <div className="bg-card border border-transparent group-hover:border-b-accent transition-all duration-300 group-hover:-translate-y-3 p-8 h-full">
                <div className="w-24 h-24 mx-auto bg-primary text-accent clip-hexagon flex items-center justify-center mb-8 shadow-lg">
                  <Clock size={36} />
                </div>
                <h4 className="text-2xl font-serif text-primary mb-4">Seamless Planning</h4>
                <p className="text-muted-foreground leading-relaxed">From securing your $1,500 permit to luxury lodge bookings, we handle every detail flawlessly.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 md:py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 leaf-bg opacity-30" />
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <ScrollReveal>
            <Star className="mx-auto text-accent mb-8 sm:mb-12" fill="currentColor" size={40} />
            <div
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
              onScroll={(e) => {
                const el = e.currentTarget;
                if (!el.clientWidth) return;
                setActiveQuote(Math.round(el.scrollLeft / el.clientWidth));
              }}
            >
              {testimonials.map((testimonial, i) => (
                <div key={i} className="min-w-full px-1 sm:px-4 md:px-12 text-center relative shrink-0 snap-center">
                  <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 text-display text-accent opacity-10 text-[12rem] leading-none select-none pointer-events-none">"</div>
                  <h3 className="text-2xl sm:text-3xl md:text-5xl text-display leading-relaxed mb-8 sm:mb-10 text-white/90 relative z-10 text-balance">
                    "{testimonial.text}"
                  </h3>
                  <div className="gold-line mb-6 mx-auto max-w-[200px]" />
                  <p className="text-accent uppercase tracking-widest font-bold text-sm mb-2">{testimonial.author}</p>
                  <p className="text-white/60 text-sm font-sans">{testimonial.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3 mt-8 sm:mt-12">
              {testimonials.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === activeQuote ? "bg-accent" : "bg-white/20"}`} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {posts.length ? (
      <section className="py-16 sm:py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">The Journal</h2>
                <h3 className="text-4xl sm:text-5xl md:text-6xl text-display text-foreground leading-tight">Stories from the forest</h3>
              </div>
              <Link href="/blog">
                <div className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors cursor-pointer uppercase tracking-wider font-semibold text-sm group">
                  All stories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <ScrollReveal key={post.slug} delay={index * 0.1} direction="up">
                <Link href={`/blog/${post.slug}`}>
                  <article className="group cursor-pointer h-full">
                    <div className="relative h-56 overflow-hidden mb-6">
                      <SeoImage src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.04]" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                      {post.category}{formatPostDate(post.publishedAt) ? ` · ${formatPostDate(post.publishedAt)}` : ""}
                    </p>
                    <h4 className="text-2xl font-serif text-primary mb-3 group-hover:text-accent transition-colors text-balance">{post.title}</h4>
                    <p className="text-muted-foreground font-sans text-sm line-clamp-3">{post.excerpt}</p>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* CTA Strip */}
      <section className="py-0 relative">
        <div className="bg-primary p-8 sm:p-16 md:p-28 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-accent" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl md:text-6xl text-display text-white mb-4 sm:mb-6">{settings.cta_title}</h2>
            <p className="text-white/80 text-base sm:text-xl font-sans">{settings.cta_body}</p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link href="/contact">
              <div className="group rounded-full px-8 sm:px-12 py-4 sm:py-6 bg-accent text-primary font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer text-center flex items-center gap-3 sm:gap-4 text-sm sm:text-lg">
                Start Your Journey <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      </main>
      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}