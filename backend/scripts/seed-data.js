export const seedTours = [
  {
    slug: "gorilla-trekking",
    title: "Gorilla Trekking",
    park: "Volcanoes National Park",
    duration: "1-3 Days",
    price: "From $1,500/person (Permit)",
    description:
      "Rwanda's iconic mountain gorilla experience. Trek through bamboo forests to spend a life-changing hour with a habituated gorilla family.",
    long_description:
      "Stand face to face with one of the world's last remaining mountain gorilla populations in the mist-shrouded Virunga volcanoes. Led by expert trackers and park rangers, you'll hike through bamboo zones and dense montane forest until you reach a habituated family — then spend a full, unforgettable hour observing silverbacks, mothers, and playful juveniles in their natural habitat. Every permit directly funds conservation and community development.",
    highlights: [
      "One hour with a habituated mountain gorilla family",
      "Expert local trackers and park ranger guides",
      "Volcanoes National Park — home to Dian Fossey's legacy",
      "Optional golden monkey add-on or cultural village visit",
      "Luxury lodge or boutique guesthouse accommodation",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Briefing",
        body: "Private transfer from Kigali to Volcanoes National Park. Evening briefing at park headquarters covering trekking etiquette, what to expect, and group assignment for the following day.",
      },
      {
        day: 2,
        title: "Gorilla Trek",
        body: "Early morning trek (2–6 hours depending on family location). One magical hour with the gorillas, followed by certificate presentation and return to lodge. Optional afternoon at Iby'Iwacu cultural village.",
      },
      {
        day: 3,
        title: "Departure or Extension",
        body: "Leisurely breakfast and scenic drive back to Kigali, or extend with golden monkey trekking, Bisoke volcano hike, or a second gorilla trek.",
      },
    ],
    inclusions: [
      "Gorilla trekking permit ($1,500 value)",
      "Professional guide and park ranger fees",
      "Accommodation (1-2 nights)",
      "All meals during the safari",
      "Private 4x4 transport",
      "Bottled water in vehicle",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses and tips",
      "Visa fees",
      "Optional activities not listed",
    ],
    difficulty: "Moderate — 2 to 6 hours trekking at 2,500–4,000m altitude",
    best_time: "June–September & December–February (dry seasons)",
    group_size: "Maximum 8 trekkers per gorilla family",
    image: "/uploads/hero-gorilla.jpg",
    gallery: [
      { src: "/uploads/hero-gorilla.jpg", caption: "Silverback in the mist — Volcanoes NP" },
      { src: "/uploads/gorilla-family.jpg", caption: "A habituated gorilla family at rest" },
      { src: "/uploads/gorilla-eyes.jpg", caption: "An unforgettable close encounter" },
      { src: "/uploads/hero-volcanoes.jpg", caption: "The Virunga volcano skyline" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Trekking through bamboo forest" },
      { src: "/uploads/safari-lodge.jpg", caption: "Luxury lodge with volcano views" },
    ],
    featured: 1,
    published: 1,
    sort_order: 1,
  },
  {
    slug: "chimp-trekking",
    title: "Chimpanzee Trekking",
    park: "Nyungwe Forest",
    duration: "2-4 Days",
    price: "From $200/person",
    description:
      "Track our closest living relatives through the oldest rainforest in central Africa, home to vibrant biodiversity.",
    long_description:
      "Nyungwe Forest National Park is one of Africa's oldest rainforests — a cathedral of ancient trees where chimpanzees, colobus monkeys, and over 300 bird species thrive. Follow experienced trackers through moss-covered trails as chimpanzee calls echo through the canopy. The experience is raw, immersive, and unlike anything on the savanna.",
    highlights: [
      "Track wild chimpanzees in ancient montane rainforest",
      "Canopy walkway — 70m above the forest floor",
      "13 primate species including colobus monkeys",
      "Over 300 bird species for enthusiasts",
      "Tea plantation visits in surrounding highlands",
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to Nyungwe",
        body: "Scenic drive from Kigali through rolling tea country to Nyungwe. Check in at forest lodge and evening orientation on chimp tracking protocols.",
      },
      {
        day: 2,
        title: "Chimpanzee Trek",
        body: "Pre-dawn departure to track chimpanzee communities. Trek 2–4 hours through dense forest. Afternoon canopy walkway experience suspended above the treetops.",
      },
      {
        day: 3,
        title: "Forest Exploration",
        body: "Optional colobus monkey trek, waterfall hike, or birding walk. Visit a local tea cooperative before returning to Kigali.",
      },
    ],
    inclusions: [
      "Chimpanzee trekking permit",
      "Canopy walkway entry",
      "Expert guide and park fees",
      "Accommodation and meals",
      "Private transport",
    ],
    exclusions: ["International flights", "Travel insurance", "Personal expenses and tips", "Visa fees"],
    difficulty: "Moderate — steep, muddy trails in humid forest conditions",
    best_time: "Year-round; chimps easier to track in wet season (more fruit)",
    group_size: "Maximum 8 trekkers per group",
    image: "/uploads/chimp-nyungwe.jpg",
    gallery: [
      { src: "/uploads/chimp-nyungwe.jpg", caption: "Chimpanzee in Nyungwe's ancient canopy" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Deep forest trekking trails" },
      { src: "/uploads/rwanda-hills.jpg", caption: "Rolling hills of tea country" },
      { src: "/uploads/rwanda-safari.jpg", caption: "Nyungwe's lush rainforest" },
      { src: "/uploads/birding.jpg", caption: "Albertine Rift endemic species" },
    ],
    featured: 0,
    published: 1,
    sort_order: 2,
  },
  {
    slug: "golden-monkey",
    title: "Golden Monkey Trekking",
    park: "Volcanoes National Park",
    duration: "1-2 Days",
    price: "From $100/person",
    description:
      "Observe the playful, endemic golden monkeys as they leap through the bamboo zone of the Virunga volcanoes.",
    long_description:
      "The golden monkey is endemic to the Virunga massif — a dazzling, acrobatic primate found only in the bamboo forests of Rwanda, Uganda, and DRC. This shorter trek is perfect as a standalone experience or as an add-on to gorilla trekking, offering lighter hiking and incredible photographic opportunities as troops leap between bamboo stems.",
    highlights: [
      "Endemic golden monkey species — found nowhere else on Earth",
      "Shorter, less strenuous trek than gorilla tracking",
      "Perfect add-on to a gorilla safari",
      "Excellent photography in bamboo forest light",
      "Same stunning Virunga volcano backdrop",
    ],
    itinerary: [
      {
        day: 1,
        title: "Golden Monkey Trek",
        body: "Morning briefing and short trek (1–3 hours) into the bamboo zone. Spend up to one hour with a golden monkey troop. Afternoon at leisure or optional cultural visit.",
      },
      {
        day: 2,
        title: "Return to Kigali",
        body: "Relaxed morning at lodge with volcano views. Scenic transfer back to Kigali with optional stop at the Ellen DeGeneres Campus of the Dian Fossey Gorilla Fund.",
      },
    ],
    inclusions: [
      "Golden monkey trekking permit",
      "Park ranger and guide fees",
      "Accommodation (1 night)",
      "Meals and private transport",
    ],
    exclusions: ["International flights", "Travel insurance", "Personal expenses and tips", "Visa fees"],
    difficulty: "Easy to moderate — 1 to 3 hours on bamboo forest trails",
    best_time: "Year-round; dry seasons offer clearer volcano views",
    group_size: "Maximum 8 trekkers per group",
    image: "/uploads/golden-monkey.jpg",
    gallery: [
      { src: "/uploads/golden-monkey.jpg", caption: "Golden monkey leaping through bamboo" },
      { src: "/uploads/hero-volcanoes.jpg", caption: "Virunga peaks at dawn" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Light-filled bamboo zone trails" },
      { src: "/uploads/gorilla-family.jpg", caption: "Primate country — Volcanoes NP" },
    ],
    featured: 0,
    published: 1,
    sort_order: 3,
  },
  {
    slug: "rwanda-grand",
    title: "Rwanda Grand Safari",
    park: "Multiple Parks",
    duration: "7 Days",
    price: "From $3,500/person",
    description:
      "The ultimate journey: gorillas, chimps, Akagera savanna safari, and a poignant Kigali cultural tour.",
    long_description:
      "This is Rwanda in full — from the misty volcanoes of the north to the ancient rainforest of Nyungwe and the sweeping savannas of Akagera. Over seven days you'll encounter mountain gorillas, chimpanzees, the Big Five, and the resilient spirit of Kigali. Every transfer, lodge, and guide is handpicked for seamless luxury.",
    highlights: [
      "Mountain gorilla trekking in Volcanoes NP",
      "Chimpanzee tracking in Nyungwe Forest",
      "Big Five game drives in Akagera National Park",
      "Kigali Genocide Memorial and city tour",
      "Handpicked luxury lodges throughout",
    ],
    itinerary: [
      {
        day: 1,
        title: "Kigali Arrival",
        body: "Airport meet-and-greet, city tour including Genocide Memorial and local craft markets. Welcome dinner at a premier Kigali restaurant.",
      },
      {
        day: 2,
        title: "Transfer to Volcanoes",
        body: "Drive to Volcanoes National Park through the Land of a Thousand Hills. Lodge check-in and trekking briefing.",
      },
      {
        day: 3,
        title: "Gorilla Trek",
        body: "Full gorilla trekking experience with one hour with a habituated family. Afternoon at leisure.",
      },
      {
        day: 4,
        title: "Nyungwe Forest",
        body: "Scenic transfer to Nyungwe. Canopy walkway and forest lodge arrival.",
      },
      {
        day: 5,
        title: "Chimpanzee Trek",
        body: "Morning chimp tracking in Nyungwe. Afternoon birding or waterfall walk.",
      },
      {
        day: 6,
        title: "Akagera Safari",
        body: "Transfer to Akagera National Park. Afternoon and evening game drives — lions, elephants, giraffes, and hippos.",
      },
      {
        day: 7,
        title: "Departure",
        body: "Morning game drive, then return to Kigali for international departure.",
      },
    ],
    inclusions: [
      "Gorilla and chimpanzee permits",
      "Akagera park fees and game drives",
      "6 nights luxury accommodation",
      "All meals and private 4x4 transport",
      "Expert guide throughout",
      "Kigali city tour",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses and tips",
      "Visa fees",
      "Optional golden monkey trek",
    ],
    difficulty: "Moderate — multiple trekking days at varying altitudes",
    best_time: "June–September & December–February",
    group_size: "Private or small groups up to 6 guests",
    image: "/uploads/rwanda-safari.jpg",
    gallery: [
      { src: "/uploads/rwanda-safari.jpg", caption: "Akagera savanna at golden hour" },
      { src: "/uploads/safari-lodge.jpg", caption: "Handpicked luxury lodges" },
      { src: "/uploads/hero-gorilla.jpg", caption: "Mountain gorilla trekking" },
      { src: "/uploads/chimp-nyungwe.jpg", caption: "Chimpanzee tracking in Nyungwe" },
      { src: "/uploads/kigali-skyline.jpg", caption: "Kigali city tour & memorial" },
      { src: "/uploads/rwanda-hills.jpg", caption: "The Land of a Thousand Hills" },
    ],
    featured: 1,
    published: 1,
    sort_order: 4,
  },
  {
    slug: "east-africa-combo",
    title: "East Africa Combo",
    park: "Rwanda, Uganda, Kenya",
    duration: "10 Days",
    price: "From $6,000/person",
    description:
      "Cross borders to experience Rwanda's gorillas, Uganda's wildlife, and the sweeping plains of Kenya's Masai Mara.",
    long_description:
      "The definitive East African adventure. Begin with Rwanda's mountain gorillas, cross into Uganda's Queen Elizabeth National Park for tree-climbing lions and Kazinga Channel boat safaris, then fly to Kenya's Masai Mara for the Great Migration spectacle. Three countries, three ecosystems, one extraordinary journey.",
    highlights: [
      "Rwanda gorilla trekking — Volcanoes NP",
      "Uganda tree-climbing lions in Queen Elizabeth NP",
      "Kazinga Channel hippo and buffalo boat cruise",
      "Masai Mara game drives and optional hot air balloon",
      "Cross-border logistics fully handled",
    ],
    itinerary: [
      { day: 1, title: "Kigali Arrival", body: "Welcome to Rwanda. Transfer to hotel and evening briefing on the 10-day journey ahead." },
      { day: 2, title: "Gorilla Trek", body: "Full day gorilla trekking experience in Volcanoes National Park." },
      { day: 3, title: "Cross to Uganda", body: "Scenic drive across the border to Queen Elizabeth National Park, Uganda." },
      { day: 4, title: "Queen Elizabeth Safari", body: "Morning game drive for tree-climbing lions. Afternoon Kazinga Channel boat safari." },
      { day: 5, title: "Transfer & Flight", body: "Drive to Entebbe and fly to Nairobi, Kenya." },
      { day: 6, title: "Masai Mara", body: "Fly to the Masai Mara. Afternoon game drive on the savanna." },
      { day: 7, title: "Full Day Safari", body: "Sunrise and sunset game drives. Optional hot air balloon at dawn." },
      { day: 8, title: "Mara Exploration", body: "Full day on the Mara — big cats, wildebeest herds, and Maasai village visit." },
      { day: 9, title: "Return to Nairobi", body: "Morning game drive, fly back to Nairobi. Farewell dinner." },
      { day: 10, title: "Departure", body: "Transfer to airport for international departure." },
    ],
    inclusions: [
      "Gorilla permit (Rwanda)",
      "All park fees across three countries",
      "Domestic flights (Uganda–Kenya)",
      "9 nights premium accommodation",
      "All meals and private transport",
      "Expert multi-country guide team",
    ],
    exclusions: [
      "International flights",
      "Travel insurance and visas (3 countries)",
      "Hot air balloon safari (optional)",
      "Personal expenses and tips",
    ],
    difficulty: "Moderate to active — long travel days and trekking",
    best_time: "July–October for Great Migration in the Mara",
    group_size: "Private or small groups up to 6 guests",
    image: "/uploads/hero-volcanoes.jpg",
    gallery: [
      { src: "/uploads/hero-volcanoes.jpg", caption: "Rwanda's Virunga volcanoes" },
      { src: "/uploads/rwanda-safari.jpg", caption: "Cross-border safari adventure" },
      { src: "/uploads/safari-lodge.jpg", caption: "Premium camps across East Africa" },
      { src: "/uploads/hero-gorilla.jpg", caption: "Rwanda gorilla trekking" },
      { src: "/uploads/chimp-nyungwe.jpg", caption: "Uganda's Queen Elizabeth NP" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Masai Mara game drives" },
    ],
    featured: 0,
    published: 1,
    sort_order: 5,
  },
  {
    slug: "birding-safari",
    title: "Birding Safari",
    park: "Nyungwe & Akagera",
    duration: "5 Days",
    price: "From $450/person",
    description:
      "A specialized tour tracking over 290 bird species across Rwanda's diverse ecosystems.",
    long_description:
      "Rwanda packs extraordinary avian diversity into a country smaller than Maryland. From Albertine Rift endemics in Nyungwe's ancient forest to waterbirds and raptors on Akagera's lakes and savannas, this specialist itinerary is led by expert birding guides with quality optics provided.",
    highlights: [
      "290+ bird species across two distinct ecosystems",
      "Albertine Rift endemics — including Rockefeller's sunbird",
      "Nyungwe Forest and Akagera National Park",
      "Expert ornithologist guide with quality optics",
      "Shoebill stork excursion (seasonal, Uganda day trip optional)",
    ],
    itinerary: [
      { day: 1, title: "Arrival & Nyungwe", body: "Transfer from Kigali to Nyungwe Forest. Afternoon introductory birding walk around lodge grounds." },
      { day: 2, title: "Nyungwe Forest Birding", body: "Full day forest birding — target Albertine Rift endemics, turacos, and hornbills. Canopy walkway for canopy species." },
      { day: 3, title: "Nyungwe Deep Forest", body: "Early morning birding on forest trails. Afternoon transfer toward Akagera." },
      { day: 4, title: "Akagera Wetlands & Savanna", body: "Lake Ihema boat safari for waterbirds, papyrus gonolek, and fish eagles. Afternoon savanna raptor watch." },
      { day: 5, title: "Final Birding & Departure", body: "Morning birding session. Return to Kigali with species checklist review." },
    ],
    inclusions: [
      "Expert birding guide",
      "Quality binoculars (loan)",
      "All park and activity fees",
      "4 nights accommodation",
      "All meals and transport",
      "Printed species checklist",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal binoculars (optional)",
      "Visa fees",
    ],
    difficulty: "Easy to moderate — early starts, varied terrain",
    best_time: "November–April for migratory species; year-round for endemics",
    group_size: "Small groups up to 6 birders",
    image: "/uploads/birding.jpg",
    gallery: [
      { src: "/uploads/birding.jpg", caption: "Endemic species in Nyungwe Forest" },
      { src: "/uploads/chimp-nyungwe.jpg", caption: "Forest canopy birding" },
      { src: "/uploads/rwanda-hills.jpg", caption: "Albertine Rift landscapes" },
      { src: "/uploads/rwanda-safari.jpg", caption: "Akagera wetland species" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Expert-guided ornithology walks" },
    ],
    featured: 0,
    published: 1,
    sort_order: 6,
  },
];

export const seedGallery = [
  { src: "/uploads/hero-gorilla.jpg", alt: "Silverback Gorilla in the Mist", category: "Gorillas", sort_order: 1 },
  { src: "/uploads/rwanda-hills.jpg", alt: "Rolling Hills of Rwanda", category: "Landscapes", sort_order: 2 },
  { src: "/uploads/chimp-nyungwe.jpg", alt: "Chimpanzee in Nyungwe Canopy", category: "Primates", sort_order: 3 },
  { src: "/uploads/hero-volcanoes.jpg", alt: "Virunga Volcanoes Skyline", category: "Landscapes", sort_order: 4 },
  { src: "/uploads/gorilla-eyes.jpg", alt: "The Stare of a Silverback", category: "Gorillas", sort_order: 5 },
  { src: "/uploads/golden-monkey.jpg", alt: "Golden Monkey in Bamboo", category: "Primates", sort_order: 6 },
  { src: "/uploads/trekkers-forest.jpg", alt: "Trekkers Navigating the Forest", category: "Safari", sort_order: 7 },
  { src: "/uploads/rwanda-safari.jpg", alt: "Safari Vehicle in Akagera", category: "Safari", sort_order: 8 },
  { src: "/uploads/gorilla-family.jpg", alt: "Gorilla Family Resting", category: "Gorillas", sort_order: 9 },
  { src: "/uploads/safari-lodge.jpg", alt: "Luxury Safari Lodge", category: "Safari", sort_order: 10 },
  { src: "/uploads/kigali-skyline.jpg", alt: "Kigali Skyline at Dusk", category: "Landscapes", sort_order: 11 },
  { src: "/uploads/birding.jpg", alt: "Endemic Bird Species", category: "Safari", sort_order: 12 },
];

export const seedTestimonials = [
  {
    author: "Sarah & James Mitchell",
    sub: "Gorilla Trekking & Nyungwe Combo, 2023",
    text: "Looking into the eyes of a silverback in the wild changes you. Primates Quest orchestrated every detail perfectly. It wasn't just a tour; it was a profound life experience.",
    sort_order: 1,
    published: 1,
  },
  {
    author: "David Arquette",
    sub: "Rwanda Grand Safari, 2024",
    text: "From the luxury lodge to the moment the mist cleared in the Virungas, every second felt handcrafted. The guides were exceptionally knowledgeable.",
    sort_order: 2,
    published: 1,
  },
  {
    author: "Elena & Marco Ricci",
    sub: "East Africa Combo, 2023",
    text: "We were worried about the logistics, but they handled absolutely everything. A truly premium service that let us just focus on the magic of the rainforest.",
    sort_order: 3,
    published: 1,
  },
];

export const seedFaqs = [
  {
    question: "When is the best time to visit Rwanda?",
    answer: "March–June and Sep–Dec, avoiding the long rains.",
    sort_order: 1,
  },
  {
    question: "How far in advance should I book?",
    answer: "Gorilla permits sell 6–12 months ahead; book early.",
    sort_order: 2,
  },
  {
    question: "Is gorilla trekking physically demanding?",
    answer: "Moderate difficulty, 2–6 hours of trekking at altitude.",
    sort_order: 3,
  },
  {
    question: "What's included in the permit price?",
    answer: "Park entry, ranger guide, 1 hour with gorillas; accommodation separate.",
    sort_order: 4,
  },
];

export const seedSettings = {
  site_name: "Primates Quest Safaris",
  tagline: "Where the mist parts for those who seek.",
  logo: "/uploads/logo.png",
  phone: "+250 788 000 000",
  email: "info@primatequestsafaris.com",
  email_bookings: "bookings@primatequestsafaris.com",
  address_line1: "Kigali Heights, KN 7 Rd",
  address_line2: "P.O Box 1234",
  address_city: "Kigali, Rwanda",
  whatsapp: "250788000000",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
  footer_blurb:
    "Premium gorilla and chimpanzee trekking experiences in Rwanda's most spectacular national parks. Where wilderness becomes unforgettable.",
  hero_eyebrow: "Rwanda's Premier Wildlife Experience",
  hero_title: "Lock Eyes With\nThe Wild",
  hero_cta: "Explore Our Tours",
  hero_image: "/uploads/hero-gorilla.jpg",
  intro_label: "Our Philosophy",
  intro_title: "Where ancient rainforest meets volcano skylines.",
  intro_body:
    "Primates Quest Safaris is built for travelers who want to experience nature profoundly. We believe in unhurried, exclusive encounters with Rwanda's most majestic creatures. Stand in the mist of the Virunga peaks and listen to the silence before a silverback emerges.",
  intro_image: "/uploads/chimp-nyungwe.jpg",
  years_experience: "12",
  permit_success: "100",
  happy_guests: "4500",
  national_parks: "4",
  cta_title: "Ready for the wild?",
  cta_body: "Permits are limited and book up months in advance. Start planning your Rwandan adventure today.",
  about_title: "Beyond The Safari",
  about_subtitle: "Crafting legends in the mist.",
  about_intro:
    "Primates Quest Safaris was born from a deep love for Rwanda's wilderness and a commitment to protecting its future. We don't just guide tours; we share our home.",
  about_story_title: "Born in the land of a thousand hills.",
  about_story_p1:
    "Founded by native Rwandans who grew up in the shadows of the Virunga volcanoes, our company is built on an intimate knowledge of the land. We've spent decades walking these forests, studying animal behavior, and building relationships with local communities.",
  about_story_p2:
    "To us, luxury isn't just about fine lodges—it's about exclusive access, seamless logistics, and the peace of mind that comes from traveling with true local experts.",
  about_image: "/uploads/rwanda-hills.jpg",
  about_roots_label: "Our Roots",
  conservation_label: "Conservation First",
  conservation_title: "Protecting what we love.",
  conservation_body:
    "The survival of the mountain gorilla is one of the world's greatest conservation success stories. We dedicate a percentage of our profits to grassroots conservation efforts that protect forests, wildlife, and the communities who live beside them.",
  about_stat_1_value: "$1.5k",
  about_stat_1_text: "Every gorilla permit directly funds park protection and community projects.",
  about_stat_2_value: "100%",
  about_stat_2_text: "We employ local guides, porters, and drivers, ensuring tourism benefits our immediate communities.",
  about_stat_3_value: "0",
  about_stat_3_text: "We practice strict 'Leave No Trace' policies on all our expeditions, leaving the forest as we found it.",
  about_badge: "LEAVE NO TRACE",
  team_image: "/uploads/trekkers-forest.jpg",
  featured_secondary_image: "/uploads/safari-lodge.jpg",
};

export const seedPosts = [
  {
    slug: "how-to-prepare-for-gorilla-trekking",
    title: "How to prepare for a gorilla trek in Rwanda",
    excerpt:
      "Permits, fitness, packing, and park etiquette — what actually matters before you meet a silverback in Volcanoes National Park.",
    body: `A gorilla trek is the centrepiece of most Rwanda safaris, and a little preparation makes the day smoother.

Book the permit first. Rwanda gorilla permits are limited and often sell out 6–12 months ahead for peak months. Once the permit is confirmed, lodges and internal flights fall into place.

Fitness is moderate, not extreme. You may walk two to six hours on muddy, steep trails at altitude. Comfortable broken-in boots, a rain jacket, and gardening gloves for stinging nettles are more useful than specialist kit.

On the morning of the trek, rangers assign families and brief you on distance. Stay seven metres from the gorillas, speak quietly, and follow your tracker. Flash photography is not allowed.

Every permit funds park protection and neighbouring communities. That hour in the forest is conservation in action, not only a photograph.`,
    image: "/uploads/hero-gorilla.jpg",
    gallery: [
      { src: "/uploads/gorilla-family.jpg", caption: "A habituated family at rest in Volcanoes National Park" },
      { src: "/uploads/trekkers-forest.jpg", caption: "The trail climbs through bamboo and montane forest" },
      { src: "/uploads/gorilla-eyes.jpg", caption: "Keep seven metres, no flash, and let the hour unfold" },
    ],
    category: "Gorillas",
    author: "Primates Quest Safaris",
    published: 1,
    published_at: "2026-06-12 09:00:00",
  },
  {
    slug: "best-time-to-visit-rwanda",
    title: "When to visit Rwanda for wildlife",
    excerpt:
      "Dry seasons, green-season trekking, chimpanzees in Nyungwe, and what changes month by month across the parks.",
    body: `Rwanda is a year-round destination, but the feel of each park shifts with the rains.

June to September and December to February are the drier windows. Trails in Volcanoes National Park are firmer, and Akagera game drives are easier. These months are also the busiest for gorilla permits.

March to May and October to November bring rain. Forests are lush, birding is excellent, and lodges are quieter. Treks still run; you will simply walk in mud and mist.

Nyungwe chimpanzee tracking works in both seasons. Primates are active in the canopy year-round. Combine a gorilla trek with Nyungwe or Akagera if you have seven days or more.

We plan around your dates rather than forcing a single “best” month. Permits and lodge availability usually decide the calendar more than the weather.`,
    image: "/uploads/rwanda-hills.jpg",
    gallery: [
      { src: "/uploads/rwanda-safari.jpg", caption: "Akagera opens up in the drier months" },
      { src: "/uploads/hero-volcanoes.jpg", caption: "Volcanoes National Park holds mist even in the green season" },
      { src: "/uploads/safari-lodge.jpg", caption: "Lodge nights are easier to find outside peak permit weeks" },
    ],
    category: "Safari",
    author: "Primates Quest Safaris",
    published: 1,
    published_at: "2026-07-03 09:00:00",
  },
  {
    slug: "nyungwe-chimpanzees-and-canopy",
    title: "Nyungwe: chimpanzees, canopy, and ancient forest",
    excerpt:
      "Why Nyungwe National Park belongs on a Rwanda itinerary even if gorillas are the main reason you came.",
    body: `Nyungwe is one of Africa’s oldest rainforests. It sits in the south-west, a few hours from Volcanoes, and it is the place to track chimpanzees.

Treks start early. You follow a habituated community with rangers who know the valleys. Sightings are not guaranteed in the way gorilla families usually are, which is part of the wildness.

The canopy walkway hangs above the trees with views across the Albertine Rift. Birders come for endemic species; walkers come for waterfalls and tea-country roads.

Add two nights if you can. Nyungwe rewards an unhurried morning and a second chance at chimps if the first day is quiet.

We sequence Nyungwe before or after Volcanoes so the drive makes sense, with a Kigali night on either end if flights demand it.`,
    image: "/uploads/chimp-nyungwe.jpg",
    gallery: [
      { src: "/uploads/forest-canopy.jpg", caption: "The canopy walkway hangs above one of Africa’s oldest rainforests" },
      { src: "/uploads/birding.jpg", caption: "Albertine Rift endemics keep birders in Nyungwe for extra days" },
      { src: "/uploads/trekkers-forest.jpg", caption: "Chimp treks start early, with rangers who know the valleys" },
    ],
    category: "Primates",
    author: "Primates Quest Safaris",
    published: 1,
    published_at: "2026-07-28 09:00:00",
  },
];
