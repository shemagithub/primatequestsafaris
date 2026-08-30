import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import NotFound from "@/pages/not-found";
import { useSite } from "@/context/SiteContext";
import type { Post } from "@/data/content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  formatPostDate,
  graphJsonLd,
  organizationJsonLd,
  truncateMeta,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight } from "lucide-react";

type StoryImage = { src: string; caption?: string };
type StoryBlock =
  | { type: "text"; text: string; drop?: boolean; quote?: boolean }
  | { type: "image"; src: string; caption?: string; variant: number; n: number };

function storyImages(post: Post): StoryImage[] {
  const items = Array.isArray(post.gallery) ? post.gallery : [];
  return items
    .map((item) => ({ src: String(item?.src || "").trim(), caption: item?.caption || "" }))
    .filter((item) => item.src && item.src !== post.image);
}

function isPhotoMarker(text: string) {
  return /^\[(photo|image|img)\]$/i.test(text.trim());
}

function isQuoteMarker(text: string) {
  const clean = text.trim();
  if (/^\[quote\]/i.test(clean)) return true;
  if (/^>\s+\S/.test(clean)) return true;
  return /^["“][^"“”]{24,}["”]$/.test(clean);
}

function quoteText(text: string) {
  return text
    .trim()
    .replace(/^\[quote\]\s*/i, "")
    .replace(/^>\s+/, "")
    .replace(/^["“]|["”]$/g, "");
}

function readingMinutes(post: Post) {
  const words = `${post.excerpt || ""} ${post.body || ""}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function buildStory(post: Post): StoryBlock[] {
  const images = storyImages(post);
  const chunks = String(post.body || "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const blocks: StoryBlock[] = [];
  let imageIndex = 0;
  const marked = chunks.some(isPhotoMarker);

  const pushImage = () => {
    const photo = images[imageIndex];
    if (!photo) return;
    blocks.push({
      type: "image",
      src: photo.src,
      caption: photo.caption,
      variant: imageIndex % 3,
      n: imageIndex + 1,
    });
    imageIndex += 1;
  };

  if (marked) {
    for (const chunk of chunks) {
      if (isPhotoMarker(chunk)) pushImage();
      else blocks.push({ type: "text", text: quoteText(chunk), quote: isQuoteMarker(chunk) });
    }
  } else {
    let sinceImage = 0;
    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      blocks.push({ type: "text", text: quoteText(chunk), quote: isQuoteMarker(chunk) });
      sinceImage += 1;
      const afterOpening = i === 0 && images[imageIndex];
      if ((afterOpening || sinceImage >= 2) && images[imageIndex]) {
        pushImage();
        sinceImage = 0;
      }
    }
  }

  while (imageIndex < images.length) pushImage();

  const firstText = blocks.find((block) => block.type === "text" && !block.quote);
  if (firstText && firstText.type === "text") firstText.drop = true;
  return blocks;
}

function StoryPhoto({
  src,
  caption,
  variant,
  n,
  total,
  title,
}: {
  src: string;
  caption?: string;
  variant: number;
  n: number;
  total: number;
  title: string;
}) {
  const index = String(n).padStart(2, "0");
  const of = String(total).padStart(2, "0");
  const frame =
    variant === 1
      ? "md:max-w-[28rem] md:ml-auto"
      : variant === 2
        ? "md:max-w-[30rem] md:ml-0"
        : "blog-figure-wide";
  const height = variant === 0 ? "h-[260px] sm:h-[420px] md:h-[480px]" : "h-[240px] sm:h-[360px]";

  return (
    <figure className={`blog-figure my-12 sm:my-16 ${frame}`}>
      <div className="relative overflow-hidden bg-primary/10 shadow-[0_28px_70px_rgba(20,58,24,0.18)]">
        <div className="absolute inset-0 outline outline-1 outline-accent/45 -outline-offset-[10px] z-10 pointer-events-none" />
        <SeoImage
          src={src}
          alt={caption || title}
          className={`${height} w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]`}
        />
        <span className="absolute top-4 left-4 z-10 bg-background/90 text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1">
          {index} / {of}
        </span>
      </div>
      {caption ? (
        <figcaption className="mt-4 flex gap-3 items-start text-sm text-muted-foreground font-sans leading-relaxed max-w-xl">
          <span className="mt-2 h-px w-8 shrink-0 bg-accent" />
          <span>
            <span className="text-accent font-bold tracking-[0.16em] uppercase text-[10px] mr-2">{index}</span>
            {caption}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { posts, settings } = useSite();
  const post = posts.find((item) => item.slug === params?.slug || item.id === params?.slug);
  const related = posts.filter((item) => item.slug !== post?.slug).slice(0, 2);
  const photos = post ? storyImages(post) : [];
  const blocks = post ? buildStory(post) : [];
  const jsonLd = useMemo(
    () =>
      post
        ? graphJsonLd(
            organizationJsonLd(settings),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
            articleJsonLd(post),
          )
        : null,
    [post, settings],
  );

  if (!post) return <NotFound />;

  const dateLabel = formatPostDate(post.publishedAt);
  const minutes = readingMinutes(post);

  return (
    <PageTransition>
      <Seo
        title={post.title}
        description={truncateMeta(post.excerpt || post.body, 158)}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content">
        <section className="relative min-h-[82vh] flex items-end overflow-hidden bg-primary text-white">
          {post.image ? (
            <SeoImage
              src={post.image}
              alt={post.title}
              priority
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2410] via-[#0c2410]/50 to-[#0c2410]/15" />
          <div className="relative z-10 container mx-auto px-4 md:px-6 pb-14 sm:pb-20 pt-36 max-w-5xl">
            <ScrollReveal>
              <Link href="/blog">
                <span className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-[0.22em] mb-8 cursor-pointer hover:text-white transition-colors">
                  <ArrowLeft size={16} /> The Journal
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-accent text-[11px] font-bold uppercase tracking-[0.22em] mb-5">
                <span className="border border-accent/60 px-3 py-1">{post.category}</span>
                {dateLabel ? <span>{dateLabel}</span> : null}
                <span className="text-white/70">{minutes} min read</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl text-display leading-[0.95] text-balance max-w-4xl">
                {post.title}
              </h1>
            </ScrollReveal>
          </div>
        </section>

        <article className="relative bg-background overflow-hidden">
          <div className="hidden lg:block absolute top-28 right-6 text-[10rem] text-display text-primary/5 leading-none pointer-events-none select-none">
            “
          </div>
          <div className="container mx-auto px-4 md:px-6 max-w-3xl py-14 sm:py-20">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-primary">{post.author}</span>
              {dateLabel ? <span>{dateLabel}</span> : null}
              {photos.length ? <span>{photos.length} story photo{photos.length === 1 ? "" : "s"}</span> : null}
            </div>

            {post.excerpt ? (
              <p className="relative pl-6 sm:pl-8 mb-4 text-2xl sm:text-[1.9rem] font-serif text-primary leading-snug text-balance">
                <span className="absolute left-0 top-1 bottom-1 w-px bg-accent" />
                {post.excerpt}
              </p>
            ) : null}

            {photos.length ? (
              <div className="flex gap-2 mb-12 sm:mb-14 overflow-x-auto pb-1">
                {photos.map((photo, i) => (
                  <div key={photo.src} className="relative shrink-0 w-20 h-16 sm:w-24 sm:h-20 overflow-hidden">
                    <SeoImage src={photo.src} alt={photo.caption || post.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-12" />
            )}

            <div className="blog-prose">
              {blocks.map((block, index) => {
                if (block.type === "image") {
                  return (
                    <ScrollReveal key={`img-${block.src}-${index}`}>
                      <div className="group">
                        <StoryPhoto
                          src={block.src}
                          caption={block.caption}
                          variant={block.variant}
                          n={block.n}
                          total={photos.length}
                          title={post.title}
                        />
                      </div>
                    </ScrollReveal>
                  );
                }
                if (block.quote) {
                  return (
                    <blockquote key={index} className="my-12 sm:my-16 text-center px-2 sm:px-10">
                      <p className="text-3xl sm:text-4xl text-display text-primary leading-tight text-balance">
                        “{block.text}”
                      </p>
                      <span className="mt-6 mx-auto block h-px w-16 bg-accent" />
                    </blockquote>
                  );
                }
                return (
                  <p
                    key={index}
                    className={`text-[1.07rem] sm:text-[1.15rem] leading-[1.9] text-[#3a3530] font-sans mb-8 ${
                      block.drop ? "blog-drop" : ""
                    }`}
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            <div className="mt-16 sm:mt-20 p-8 sm:p-10 bg-primary text-white relative overflow-hidden">
              <div className="absolute -right-8 -bottom-10 text-[8rem] text-display text-white/10 leading-none">PQ</div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.22em] mb-3">Travel with us</p>
              <h2 className="text-3xl sm:text-4xl text-display mb-4 text-balance">Ready to walk this forest?</h2>
              <p className="text-white/75 font-sans mb-8 max-w-xl">
                Permits, lodges, and the quiet logistics — we plan the day so you can stay with the moment.
              </p>
              <Link href="/contact">
                <span className="inline-flex items-center gap-3 bg-accent text-primary px-7 py-3.5 font-bold uppercase tracking-wider text-sm cursor-pointer hover:bg-white transition-colors">
                  Plan this journey <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>
        </article>

        {related.length ? (
          <section className="py-16 sm:py-20 bg-[#efe8db] border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-accent mb-8">Continue reading</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {related.map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`}>
                    <article className="group grid sm:grid-cols-[12rem_1fr] gap-5 cursor-pointer">
                      <div className="h-44 sm:h-full overflow-hidden">
                        <SeoImage
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-2">
                          {item.category}
                        </p>
                        <h3 className="text-2xl font-serif text-primary group-hover:text-accent transition-colors text-balance">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}
