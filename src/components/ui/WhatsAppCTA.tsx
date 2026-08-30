import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";

export default function WhatsAppCTA() {
  const { settings } = useSite();
  const number = (settings.whatsapp || "250788000000").replace(/[^\d]/g, "");
  return (
    <motion.a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
