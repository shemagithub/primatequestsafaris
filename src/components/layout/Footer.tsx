import { Link } from "wouter";
import { useState } from "react";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";

export default function Footer() {
  const { settings, tours } = useSite();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [statusText, setStatusText] = useState("");
  const logo = settings.logo || logoUrl;

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setStatusText("");
    try {
      const result = await api.subscribe(email);
      setEmail("");
      setStatus("ok");
      setStatusText(
        result.alreadySubscribed
          ? "You are already on the Wild Circle list."
          : "Welcome — check your inbox for a confirmation.",
      );
    } catch (err) {
      setStatus("error");
      setStatusText(
        err instanceof Error && err.message
          ? err.message
          : "Could not subscribe. Please try again.",
      );
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-20 sm:pt-28 md:pt-32 pb-10 overflow-hidden" style={{ clipPath: 'polygon(0 24px, 100% 0, 100% 100%, 0 100%)' }}>
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Newsletter Row */}
        <div className="border-b border-primary-foreground/10 pb-10 sm:pb-16 mb-10 sm:mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-accent mb-2">Join Our Wild Circle</h3>
            <p className="text-primary-foreground/70 font-sans text-sm">Insider stories, conservation updates, and exclusive safari offers.</p>
          </div>
          <div className="flex w-full md:w-auto flex-col items-stretch md:items-end gap-2">
            <form onSubmit={subscribe} className="flex w-full md:w-auto flex-col sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Your email address"
              disabled={status === "loading"}
              className="bg-primary-foreground/5 border border-primary-foreground/20 px-6 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent font-sans w-full md:w-64 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-accent text-primary px-6 py-3 font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === "loading" ? "Joining..." : status === "ok" ? "Joined" : "Subscribe"}
            </button>
            </form>
            {statusText ? (
              <p className={`text-xs font-sans ${status === "error" ? "text-red-300" : "text-accent"}`}>
                {statusText}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/">
              <img src={logo} alt="Primates Quest Safaris" className="h-16 w-auto cursor-pointer" />
            </Link>
            <p className="text-primary-foreground/80 font-sans leading-relaxed text-sm">
              {settings.footer_blurb}
            </p>
            <div className="flex gap-4">
              {[
                { href: settings.instagram, label: "Instagram", Icon: Instagram },
                { href: settings.facebook, label: "Facebook", Icon: Facebook },
                { href: settings.twitter, label: "X", Icon: Twitter },
              ].map(({ href, label, Icon }) => {
                const url = href && href !== "#" ? href : "";
                const className =
                  "h-10 w-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-accent hover:text-accent hover:scale-125 hover:bg-accent/10 transition-all duration-300";
                return url ? (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Primates Quest Safaris on ${label}`}
                    className={className}
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <span key={label} aria-hidden="true" className={`${className} opacity-50`}>
                    <Icon size={18} />
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-2xl text-display text-accent mb-6">Experiences</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/80 font-sans">
              {tours.slice(0, 5).map((tour) => (
                <li key={tour.id}><Link href={`/tours/${tour.id}`}><span className="hover:text-accent transition-colors cursor-pointer">{tour.title}</span></Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-2xl text-display text-accent mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/80 font-sans">
              <li><Link href="/about"><span className="hover:text-accent transition-colors cursor-pointer">Our Story</span></Link></li>
              <li><Link href="/blog"><span className="hover:text-accent transition-colors cursor-pointer">Journal</span></Link></li>
              <li><Link href="/gallery"><span className="hover:text-accent transition-colors cursor-pointer">Gallery</span></Link></li>
              <li><Link href="/about"><span className="hover:text-accent transition-colors cursor-pointer">Conservation</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-accent transition-colors cursor-pointer">Contact Us</span></Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xl text-display text-accent mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/80 font-sans">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                <span>{settings.address_line1}<br />{settings.address_city}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a href={`tel:${settings.phone?.replace(/\s/g, "")}`} className="hover:text-accent transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Primates Quest Safaris. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center text-center sm:text-left">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent"></span> Certified Eco-Tourism Operator</span>
          </div>
        </div>
      </div>
    </footer>
  );
}