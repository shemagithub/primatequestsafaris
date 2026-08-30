import { useMemo, useState, useRef } from "react";
import { Link } from "wouter";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, Check, ChevronDown, Plus, Minus, MessageCircle } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import PageTransition from "@/components/ui/PageTransition";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Seo from "@/components/seo/Seo";
import SeoImage from "@/components/seo/SeoImage";
import DateRangeField from "@/components/ui/DateRangeField";

import { api } from "@/lib/api";
import { useSite } from "@/context/SiteContext";
import { countries } from "@/data/countries";
import { breadcrumbJsonLd, faqJsonLd, graphJsonLd, organizationJsonLd, pageMeta } from "@/lib/seo";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(2, "Please select a country"),
  language: z.string().default("English"),
  
  tours: z.array(z.string()).min(1, "Please select at least one expedition"),
  dates: z.string().min(4, "Please select your travel dates"),
  guests: z.number().min(1).max(20),
  budget: z.number().min(0).max(3),
  
  message: z.string().max(500),
  dietary: z.string().optional(),
  source: z.string().optional(),
  whatsappPref: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const FloatingInput = ({ name, label, type="text", register, errors, multiline=false, rows=3, ...props }: any) => {
  const Component = multiline ? 'textarea' : 'input';
  return (
    <div className="relative mt-6 pt-4">
      <Component
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        id={name}
        {...register(name)}
        className={`peer w-full bg-transparent border-b border-border/50 py-2 text-foreground outline-none focus:border-transparent transition-colors font-sans rounded-none placeholder-transparent ${multiline ? 'resize-none min-h-[100px]' : ''}`}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute left-0 top-6 text-muted-foreground text-sm transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-accent peer-focus:font-bold peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase pointer-events-none"
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-accent scale-x-0 peer-focus:scale-x-100 origin-left transition-transform duration-300" />
      {errors[name] && <p className="text-destructive text-[10px] font-bold uppercase mt-1 absolute -bottom-4 animate-shake">{errors[name]?.message}</p>}
    </div>
  );
};

const BudgetSlider = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  const budgetLabels = ["Under $500", "$500–$1,500", "$1,500–$3,500", "$3,500+"];
  return (
    <div className="relative pt-8 pb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
        {budgetLabels[value]}
      </div>
      <div className="relative h-2 bg-primary/10 rounded-full cursor-pointer flex items-center" 
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const val = Math.round(pct * 3);
          onChange(Math.max(0, Math.min(3, val)));
        }}>
        <div 
          className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 pointer-events-none"
          style={{ width: `${(value / 3) * 100}%` }}
        />
        <div 
          className="absolute w-6 h-6 bg-accent rotate-45 shadow-lg transition-all duration-300 -ml-3 flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ left: `${(value / 3) * 100}%` }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>
      <div className="flex justify-between mt-4 relative z-0 pointer-events-none gap-1">
        {budgetLabels.map((l, i) => (
          <div key={i} className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground w-1/4 text-center cursor-pointer pointer-events-auto hover:text-primary transition-colors leading-tight px-0.5" onClick={() => onChange(i)}>{l}</div>
        ))}
      </div>
    </div>
  );
};

export default function Contact() {
  const { settings, faqs, tourOptions } = useSite();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const defaultTour = searchParams.get("tour") || "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      language: "English",
      tours: defaultTour ? [defaultTour] : [],
      dates: "",
      guests: 2,
      budget: 1,
      message: "",
      dietary: "",
      source: "",
      whatsappPref: false,
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    let fieldsToValidate: any = [];
    if (step === 1) fieldsToValidate = ['name', 'email', 'phone', 'country', 'language'];
    if (step === 2) fieldsToValidate = ['tours', 'dates', 'guests', 'budget'];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => s + 1);
      if (window.innerWidth < 1024) {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await api.createInquiry({
        ...data,
        tours: data.tours,
        tour: data.tours.join(","),
        whatsappPref: data.whatsappPref,
      });
      setIsSuccess(true);
      form.reset();
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
      }, 8000);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "We could not send your inquiry. Please try again or email us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  const kigaliHour = (now.getUTCHours() + 2) % 24;
  const day = now.getUTCDay();
  const isOpen = day >= 1 && day <= 6 && kigaliHour >= 8 && kigaliHour < 18;
  const jsonLd = useMemo(
    () =>
      graphJsonLd(
        organizationJsonLd(settings),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
        faqJsonLd(faqs),
      ),
    [settings, faqs],
  );

  return (
    <PageTransition>
      <Seo
        title={pageMeta.contact.title}
        description={pageMeta.contact.description}
        path={pageMeta.contact.path}
        jsonLd={jsonLd}
      />
      <style>{`
        @keyframes goldShimmer {
          0% { transform: translateX(-150%) skewX(-45deg); }
          100% { transform: translateX(250%) skewX(-45deg); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          stroke-dasharray: 350;
          stroke-dashoffset: 350;
          animation: drawCheck 1.5s ease-out forwards;
          animation-delay: 0.2s;
        }
        .animate-draw-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawCheck 1s ease-out forwards;
          animation-delay: 1s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
      
      <div className="fixed top-0 left-0 w-full h-[2px] bg-accent z-[100]" />
      <Navbar />
      <main id="main-content">
      
      <div className="w-full relative z-10 bg-background">
        
        {/* Header - shown above split screen */}
        <div className="pt-32 sm:pt-40 pb-12 sm:pb-16 hidden lg:block relative overflow-hidden bg-background">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-[15vw] font-display font-bold text-primary tracking-tighter">CONTACT</span>
          </div>
          <div className="text-center relative z-10 px-4">
            <h1 className="text-5xl xl:text-6xl text-display text-primary mb-4">Begin Your Quest</h1>
            <p className="text-lg text-muted-foreground font-sans max-w-xl mx-auto">
              Our safari specialists are ready to craft your perfect Rwandan itinerary.
            </p>
          </div>
        </div>

        <section className="flex flex-col lg:flex-row min-h-[100dvh] lg:min-h-[850px] border-t border-border">
          
          {/* Left Panel */}
          <div className="lg:w-[40%] bg-primary text-white relative overflow-hidden flex flex-col pt-28 sm:pt-32 lg:pt-16 p-6 sm:p-8 lg:p-16 leaf-bg shadow-2xl z-10">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-r from-transparent via-accent/40 to-transparent w-1/2 animate-[goldShimmer_6s_infinite]" />
            </div>
            
            <svg className="absolute -bottom-20 -left-10 w-[400px] h-[400px] opacity-[0.04] text-white pointer-events-none rotate-45" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 0 C40 0, 0 40, 0 100 C0 160, 40 200, 100 200 C160 200, 200 160, 200 100 C200 40, 160 0, 100 0 Z" clipPath="url(#leaf-clip)" />
              <defs>
                <clipPath id="leaf-clip">
                  <path d="M100 0 C100 50, 50 100, 0 100 C50 100, 100 150, 100 200 C100 150, 150 100, 200 100 C150 100, 100 50, 100 0 Z" />
                </clipPath>
              </defs>
            </svg>

            <div className="relative z-10 flex flex-col h-full">
              <ScrollReveal>
                <div className="lg:hidden text-center mb-8 sm:mb-12">
                  <h1 className="text-4xl sm:text-5xl text-display text-accent mb-4">Begin Your Quest</h1>
                  <p className="text-base text-white/70 font-sans max-w-xl mx-auto">
                    Our safari specialists are ready to craft your perfect Rwandan itinerary.
                  </p>
                </div>

                <h3 className="text-3xl sm:text-4xl text-display text-accent mb-2">{settings.site_name}</h3>
                <p className="text-white/70 italic font-serif text-lg mb-8">{settings.tagline}</p>
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-[1px] flex-1 bg-accent/30" />
                  <div className="w-2 h-2 rotate-45 bg-accent shrink-0" />
                  <div className="h-[1px] flex-1 bg-accent/30" />
                </div>

                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-accent/50 flex items-center justify-center shrink-0">
                      <MapPin className="text-accent w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[10px] mb-1 text-white/50">Address</h4>
                      <p className="font-sans text-sm leading-relaxed text-white">{settings.address_line1}<br />{settings.address_line2}<br />{settings.address_city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-accent/50 flex items-center justify-center shrink-0">
                      <Phone className="text-accent w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[10px] mb-1 text-white/50">Phone & WhatsApp</h4>
                      <p className="font-sans text-sm text-white">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-accent/50 flex items-center justify-center shrink-0">
                      <Mail className="text-accent w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[10px] mb-1 text-white/50">Email</h4>
                      <p className="font-sans text-sm text-white mb-1">{settings.email}</p>
                      <p className="font-sans text-sm text-white">{settings.email_bookings}</p>
                    </div>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">
                      {isOpen ? 'Currently Open' : 'Currently Closed'} (Kigali Time)
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="mt-auto">
                <h3 className="text-2xl text-accent font-display mb-6 border-b border-white/10 pb-4">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-white/10 last:border-0 pb-2">
                      <button 
                        className="w-full flex items-center justify-between text-left group py-3" 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="font-sans text-sm font-medium text-white/90 group-hover:text-accent transition-colors pr-4">{faq.question}</span>
                        {openFaq === i ? <Minus className="text-accent w-4 h-4 shrink-0" /> : <Plus className="text-white/50 group-hover:text-accent w-4 h-4 shrink-0 transition-colors" />}
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-white/60 text-sm leading-relaxed pb-4 pt-1">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div ref={formRef} className="lg:w-[60%] bg-card p-5 sm:p-6 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
            
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-card z-50 flex flex-col items-center justify-center text-center p-8 lg:p-16"
                >
                  <div className="relative w-32 h-32 mb-8">
                    <svg className="w-full h-full text-accent drop-shadow-lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="50" cy="50" r="48" className="animate-draw" />
                      <path d="M30 50 L45 65 L70 35" className="animate-draw-path" />
                    </svg>
                    {[...Array(6)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="absolute w-2 h-2 bg-accent rotate-45 shadow-[0_0_10px_rgba(201,162,39,0.8)]"
                        initial={{ opacity: 0, x: 50, y: 50 }}
                        animate={{ 
                          opacity: [0, 1, 0], 
                          x: 50 + (Math.random() - 0.5) * 150, 
                          y: 50 + (Math.random() - 0.5) * 150 - 50 
                        }}
                        transition={{ duration: 2, delay: 0.5 + Math.random(), repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <h2 className="text-3xl sm:text-5xl text-display text-primary mb-4">Your Adventure Awaits</h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Your request is saved with our team. A confirmation email is on its way, and a specialist will reply within 24 hours — usually sooner.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Link href="/tours" className="bg-accent text-primary px-8 py-3 uppercase tracking-wider text-sm font-bold hover:bg-primary hover:text-white transition-colors relative overflow-hidden group">
                       <span className="relative z-10">Explore Our Tours &rarr;</span>
                       <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
                     </Link>
                     <Link href="/" className="border border-primary/20 text-primary px-8 py-3 uppercase tracking-wider text-sm font-bold hover:bg-primary/5 transition-colors">
                       Return Home
                     </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSuccess && (
              <ScrollReveal delay={0.3} className="flex-1 flex flex-col w-full max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-10 sm:mb-16 relative">
                   <div className="absolute left-1/2 top-[22px] w-[calc(100%-80px)] max-w-[300px] h-[2px] bg-border -translate-x-1/2 z-0">
                     <motion.div 
                       className="h-full bg-accent"
                       initial={{ width: '0%' }}
                       animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                       transition={{ duration: 0.5, ease: "easeInOut" }}
                     />
                   </div>
                   <div className="flex justify-between w-full max-w-[400px] relative z-10">
                      {[1, 2, 3].map(num => (
                         <div key={num} className="flex flex-col items-center gap-3 w-20">
                           <motion.div 
                             className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                               step === num ? 'border-accent bg-accent text-primary shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 
                               step > num ? 'border-primary bg-primary text-white' : 
                               'border-border bg-card text-muted-foreground'
                             }`}
                             animate={{ scale: step === num ? 1.1 : 1 }}
                           >
                             {step > num ? <Check className="w-5 h-5" /> : <span className="font-serif italic text-lg">{`0${num}`}</span>}
                           </motion.div>
                           <span className={`text-[9px] uppercase font-bold tracking-wider text-center ${step === num ? 'text-primary' : 'text-muted-foreground'}`}>
                             {num === 1 ? "Who's Coming" : num === 2 ? "Your Expedition" : "Final Details"}
                           </span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Step {step} of 3</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl text-display text-primary">
                    {step === 1 ? "Who's Coming?" : step === 2 ? "Your Expedition" : "Final Details"}
                  </h2>
                </div>

                <div className="flex-1 relative">
                   <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                     <div className="flex-1">
                       <AnimatePresence mode="wait">
                         <motion.div
                           key={step}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ duration: 0.3 }}
                         >
                           
                           {/* STEP 1 */}
                           {step === 1 && (
                             <div className="space-y-6">
                               <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                                 <FloatingInput name="name" label="Full Name" register={form.register} errors={form.formState.errors} />
                                 <FloatingInput name="email" label="Email Address" type="email" register={form.register} errors={form.formState.errors} />
                               </div>
                               <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                                 <FloatingInput name="phone" label="Phone / WhatsApp" register={form.register} errors={form.formState.errors} />
                                 
                                 <div className="relative mt-6 pt-4">
                                   <label className="absolute left-0 top-0 text-[10px] text-accent font-bold uppercase pointer-events-none">
                                     Country of Residence
                                   </label>
                                   <select 
                                     id="country" 
                                     {...form.register("country")} 
                                     className="peer w-full bg-transparent border-b border-border/50 py-2 text-foreground outline-none focus:border-transparent transition-colors font-sans rounded-none appearance-none cursor-pointer mt-2"
                                   >
                                     <option value="" disabled hidden>Select country...</option>
                                     {countries.map((country) => (
                                       <option key={country} value={country}>{country}</option>
                                     ))}
                                   </select>
                                   <ChevronDown className="absolute right-0 bottom-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                   <div className="absolute bottom-0 left-0 h-[2px] w-full bg-accent scale-x-0 peer-focus:scale-x-100 origin-left transition-transform duration-300" />
                                   {form.formState.errors.country && <p className="text-destructive text-[10px] font-bold uppercase mt-1 absolute -bottom-4 animate-shake">{form.formState.errors.country.message as string}</p>}
                                 </div>
                               </div>
                           
                               <div className="mt-8 pt-4">
                                 <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Language Preference</label>
                                 <div className="flex flex-wrap gap-3">
                                   {["English", "French", "Spanish", "Other"].map(lang => (
                                     <button 
                                       key={lang} 
                                       type="button"
                                       onClick={() => form.setValue("language", lang)}
                                       className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${form.watch("language") === lang ? 'bg-primary text-white border-primary' : 'border border-border text-muted-foreground hover:border-primary/30'}`}
                                     >
                                       {lang}
                                     </button>
                                   ))}
                                 </div>
                               </div>
                             </div>
                           )}

                           {/* STEP 2 */}
                           {step === 2 && (
                             <div className="space-y-10">
                               <div>
                                 <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Tours of interest</label>
                                 <p className="text-xs text-muted-foreground mb-4">Select one or more expeditions.</p>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {tourOptions.map(t => {
                                     const selected = form.watch("tours") || [];
                                     const isSelected = selected.includes(t.id);
                                     return (
                                       <button
                                         type="button"
                                         key={t.id} 
                                         onClick={() => {
                                           const next = isSelected
                                             ? selected.filter((id) => id !== t.id)
                                             : [...selected, t.id];
                                           form.setValue("tours", next, { shouldValidate: true });
                                         }}
                                         className={`relative rounded-none overflow-hidden cursor-pointer h-28 group text-left transition-transform duration-300 hover:scale-[1.02] border-2 ${isSelected ? 'border-accent shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'border-transparent'}`}
                                       >
                                         <SeoImage src={t.img} alt={`${t.name} safari in Rwanda`} className="absolute inset-0 w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                         <div className="absolute bottom-3 left-3 right-3">
                                           <h4 className="text-white text-sm md:text-base font-serif leading-tight">{t.name}</h4>
                                           <div className="text-accent text-[10px] font-bold uppercase tracking-wider mt-1">{t.price}</div>
                                         </div>
                                         {isSelected && (
                                           <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                             <Check className="w-3 h-3 text-primary stroke-[3]" />
                                           </div>
                                         )}
                                       </button>
                                     )
                                   })}
                                 </div>
                                 {form.formState.errors.tours && <p className="text-destructive text-[10px] font-bold uppercase mt-2 animate-shake">{form.formState.errors.tours.message as string}</p>}
                               </div>
                           
                               <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                                 <Controller
                                   control={form.control}
                                   name="dates"
                                   render={({ field, fieldState }) => (
                                     <DateRangeField
                                       label="Estimated travel dates"
                                       value={field.value}
                                       onChange={field.onChange}
                                       error={fieldState.error?.message}
                                     />
                                   )}
                                 />
                                 
                                 <div className="mt-6 pt-4 relative">
                                   <label className="absolute left-0 top-0 text-[10px] text-accent font-bold uppercase pointer-events-none">Number of Guests</label>
                                   <div className="flex items-center justify-center gap-6 py-2 border-b border-border/50">
                                     <button type="button" onClick={() => form.setValue("guests", Math.max(1, form.watch("guests") - 1))} className="w-10 h-10 rounded-full border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-primary transition-colors shrink-0">
                                       <Minus className="w-4 h-4" />
                                     </button>
                                     <span className="text-4xl text-display w-16 text-center text-primary">{form.watch("guests")}</span>
                                     <button type="button" onClick={() => form.setValue("guests", Math.min(20, form.watch("guests") + 1))} className="w-10 h-10 rounded-full border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-primary transition-colors shrink-0">
                                       <Plus className="w-4 h-4" />
                                     </button>
                                   </div>
                                 </div>
                               </div>
                           
                               <div className="pt-4">
                                 <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Budget Per Person</label>
                                 <BudgetSlider value={form.watch("budget")} onChange={(val) => form.setValue("budget", val)} />
                               </div>
                             </div>
                           )}

                           {/* STEP 3 */}
                           {step === 3 && (
                             <div className="space-y-8">
                               <div className="relative">
                                 <FloatingInput name="message" label="Message / Special Requests" register={form.register} errors={form.formState.errors} multiline rows={4} />
                                 <span className="absolute bottom-2 right-0 text-[10px] font-bold text-muted-foreground">{form.watch("message")?.length || 0} / 500</span>
                               </div>
                           
                               <FloatingInput name="dietary" label="Dietary or Health Requirements (Optional)" register={form.register} errors={form.formState.errors} />
                           
                               <div className="pt-4">
                                 <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">How did you hear about us?</label>
                                 <div className="flex flex-wrap gap-3">
                                   {["Google", "Social Media", "Friend", "Travel Agent", "Other"].map(src => (
                                     <button 
                                       key={src} 
                                       type="button"
                                       onClick={() => form.setValue("source", src)}
                                       className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${form.watch("source") === src ? 'bg-primary text-white border-primary' : 'border border-border text-muted-foreground hover:border-primary/30'}`}
                                     >
                                       {src}
                                     </button>
                                   ))}
                                 </div>
                               </div>
                           
                               <div className="bg-primary/5 p-6 border border-primary/10 mt-4 rounded-xl">
                                 <div className="flex items-start sm:items-center justify-between gap-4">
                                   <div className="flex items-center gap-3">
                                     <MessageCircle className="text-primary w-5 h-5 shrink-0" />
                                     <span className="text-sm font-bold text-primary">I prefer contact via WhatsApp</span>
                                   </div>
                                   <button 
                                     type="button"
                                     onClick={() => form.setValue("whatsappPref", !form.watch("whatsappPref"))}
                                     className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${form.watch("whatsappPref") ? 'bg-accent' : 'bg-primary/20'}`}
                                   >
                                     <motion.div 
                                       className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                                       animate={{ left: form.watch("whatsappPref") ? '34px' : '4px' }}
                                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                     />
                                   </button>
                                 </div>
                                 <AnimatePresence>
                                   {form.watch("whatsappPref") && (
                                     <motion.div 
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: 'auto', opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                     >
                                       <p className="text-xs text-primary/70 mt-4 flex items-center gap-2 font-medium">
                                         <Check className="w-3 h-3 text-accent" />
                                         We'll reach out on WhatsApp first.
                                       </p>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>
                             </div>
                           )}

                         </motion.div>
                       </AnimatePresence>
                     </div>

                     <div className="mt-10 sm:mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-border">
                       {step > 1 ? (
                         <button type="button" onClick={() => setStep(s => s - 1)} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 min-h-11">
                           &larr; Back
                         </button>
                       ) : <div className="hidden sm:block" />}
                       
                       {step < 3 ? (
                         <button type="button" onClick={nextStep} className="bg-accent text-primary px-8 py-4 uppercase tracking-wider text-sm font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-3 relative overflow-hidden group w-full sm:w-auto">
                           <span className="relative z-10">Next Step &rarr;</span>
                           <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
                         </button>
                       ) : (
                         <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                           {submitError ? (
                             <p className="text-destructive text-[10px] font-bold uppercase tracking-wider text-center sm:text-right">
                               {submitError}
                             </p>
                           ) : null}
                           <button
                             type="submit"
                             disabled={isSubmitting}
                             className="bg-primary text-white px-8 py-4 uppercase tracking-wider text-sm font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-auto"
                           >
                             <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
                             <Send className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isSubmitting ? 'translate-x-2 opacity-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                           </button>
                         </div>
                       )}
                     </div>
                   </form>
                </div>
              </ScrollReveal>
            )}
          </div>

        </section>
      </div>
      </main>

      <WhatsAppCTA />
      <Footer />
    </PageTransition>
  );
}
