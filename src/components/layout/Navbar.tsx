import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoFallback from "@/assets/logo.png";
import { useSite } from "@/context/SiteContext";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSite();
  const logoUrl = settings.logo || logoFallback;
  const siteName = settings.site_name || "Primates Quest Safaris";
  const title = siteName.replace(/\s+safaris$/i, "").trim() || "Primates Quest";

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/tours", label: "Tours" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f3eee4]/95 backdrop-blur-md border-b border-[#c9a227]/50 shadow-[0_10px_24px_rgba(20,58,24,0.06)]">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4 py-2.5 pt-[max(0.65rem,env(safe-area-inset-top))]">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer min-w-0">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-[#f7f1e4] p-[3px] ring-1 ring-[#c9a227]">
              <div className="h-full w-full overflow-hidden rounded-full bg-[#f7f1e4]">
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-[128%] w-[128%] max-w-none object-cover object-[center_18%] -ml-[14%] -mt-[8%]"
                />
              </div>
            </div>
            <div className="min-w-0 leading-none">
              <p className="font-serif text-[1.15rem] sm:text-[1.35rem] text-primary tracking-tight truncate">
                {title}
              </p>
              <p className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-[#c9a227]">
                Safaris
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? location === "/"
                : location === link.href || location.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`relative px-3.5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-colors ${
                    active ? "text-[#c9a227]" : "text-primary hover:text-[#c9a227]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-[#c9a227] transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
          <Link href="/contact">
            <div className="ml-3 px-5 py-2.5 bg-[#c9a227] text-primary text-[11px] font-bold uppercase tracking-[0.16em] cursor-pointer hover:bg-primary hover:text-[#f3eee4] transition-colors">
              Book Now
            </div>
          </Link>
        </nav>

        <button
          className="lg:hidden text-primary focus:outline-none z-[60] relative min-h-11 min-w-11 inline-flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 w-full h-dvh bg-[#f3eee4] flex flex-col items-center justify-center gap-5 sm:gap-7 lg:hidden z-50 px-6"
            >
              <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-[#f7f1e4] p-[3px] ring-1 ring-[#c9a227]">
                <div className="h-full w-full overflow-hidden rounded-full">
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-[128%] w-[128%] max-w-none object-cover object-[center_18%] -ml-[14%] -mt-[8%]"
                />
                </div>
              </div>
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={link.href}>
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-3xl sm:text-4xl font-serif cursor-pointer min-h-11 inline-flex items-center ${
                        location === link.href || (link.href !== "/" && location.startsWith(`${link.href}/`))
                          ? "text-[#c9a227]"
                          : "text-primary"
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                </motion.div>
              ))}
              <Link href="/contact">
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 px-10 py-3.5 bg-[#c9a227] text-primary font-bold uppercase tracking-[0.16em] cursor-pointer text-sm"
                >
                  Book Now
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
