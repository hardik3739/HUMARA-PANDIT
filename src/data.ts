import { ShopItem } from "./types";

export const CHAKRAS_INFO = [
  {
    name: "Crown",
    sanskrit: "Sahasrara",
    color: "#a855f7", // Violet
    element: "Cosmic Consciousness",
    mantra: "AUM",
    description: "The gateway to the supreme infinite consciousness. Located at the crown of the head.",
    gems: "Amethyst, Clear Quartz"
  },
  {
    name: "Third Eye",
    sanskrit: "Ajna",
    color: "#4f46e5", // Indigo
    element: "Inner Light & Perception",
    mantra: "OM / HAM-SA",
    description: "The center of intuition, divine foresight, and cosmic vision. Located between the eyebrows.",
    gems: "Blue Sapphire, Lapis Lazuli"
  },
  {
    name: "Throat",
    sanskrit: "Vishuddha",
    color: "#3b82f6", // Blue
    element: "Ether (Akasha)",
    mantra: "HAM",
    description: "The seat of sacred voice, truth, and spiritual communication. Located at the throat.",
    gems: "Blue Lace Agate, Turquoise"
  },
  {
    name: "Heart",
    sanskrit: "Anahata",
    color: "#22c55e", // Green
    element: "Air (Vayu)",
    mantra: "YAM",
    description: "The sanctuary of selfless love, compassion, and karmic union. Located at the chest center.",
    gems: "Emerald, Green Tourmaline"
  },
  {
    name: "Solar Plexus",
    sanskrit: "Manipura",
    color: "#facc15", // Yellow
    element: "Fire (Agni)",
    mantra: "RAM",
    description: "The furnace of personal power, will, and cosmic vitality. Located above the navel.",
    gems: "Yellow Sapphire, Citrine"
  },
  {
    name: "Sacral",
    sanskrit: "Svadhisthana",
    color: "#f97316", // Orange
    element: "Water (Apas)",
    mantra: "VAM",
    description: "The flowing stream of creative energy, desire, and emotional wisdom. Located below the navel.",
    gems: "Carnelian, Orange Calcite"
  },
  {
    name: "Root",
    sanskrit: "Muladhara",
    color: "#dc2626", // Red
    element: "Earth (Prithvi)",
    mantra: "LAM",
    description: "The foundation of physical grounding, lineage survival, and stability. Located at the tailbone.",
    gems: "Ruby, Red Jasper"
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "gem_ruby",
    name: "Natural Burmese Ruby (Manik)",
    sanskritName: "माणिक्य (Manikya)",
    category: "Precious Gemstone",
    graha: "Sun (Surya)",
    description: "A dazzling, deep crimson red Ruby ethically sourced from old-mine Burma. Highly recommended for command, self-esteem, leadership, and activating Surya's solar vitality.",
    price: 34500,
    rating: 4.9,
    color: "red",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Cleansed with Ganga water, raw milk, and energized with Gayatri Mantra (108 repetitions) on the holy banks of Haridwar."
  },
  {
    id: "gem_emerald",
    name: "Vibrant Colombian Emerald (Panna)",
    sanskritName: "पन्ना (Panna)",
    category: "Precious Gemstone",
    graha: "Mercury (Budh)",
    description: "An authentic, rich green Emerald with magnificent crystal clarity. Amplifies computational thoughts, financial intelligence, silver accents in speech, and creative focus.",
    price: 28000,
    rating: 4.8,
    color: "green",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Purified with honey and holy basil, activated with 'Om Budhaye Namaha' during the auspicious morning hour of Mercury (Wednesday)."
  },
  {
    id: "gem_yellow_sapphire",
    name: "Ceylon Golden Yellow Sapphire (Pukhraj)",
    sanskritName: "पुखराज (Pukhraj)",
    category: "Precious Gemstone",
    graha: "Jupiter (Guru)",
    description: "A flawless, canary gold-yellow Sapphire mined in Ratnapura (Sri Lanka). Attracts immense abundance, high spiritual wisdom, safe marriage alignment, and pure cosmic luck.",
    price: 45000,
    rating: 5.0,
    color: "yellow",
    imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Soaked in saffron-infused milk and activated by our head Pujari chanting 'Om Brim Brihaspataye Namaha' 1008 times."
  },
  {
    id: "gem_blue_sapphire",
    name: "Kashmir Rich Blue Sapphire (Neelam)",
    sanskritName: "नीलम (Neelam)",
    category: "Precious Gemstone",
    graha: "Saturn (Shani)",
    description: "An exceptional, velvet cornflower royal Blue Sapphire. Known as the fastest-acting stone in Kali Yuga, eliminating malefic blockages and granting heavy protection.",
    price: 68000,
    rating: 4.9,
    color: "blue",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Bathed in sesame oil and mustard water, consecrated under Saturn's Saturday Hora with Vedic Shani mantras."
  },
  {
    id: "gem_red_coral",
    name: "Italian Deep-Sea Red Coral (Moonga)",
    sanskritName: "मूंगा (Moonga)",
    category: "Organic Gemstone",
    graha: "Mars (Mangal)",
    description: "A beautiful, premium cylindrical oxblood-red Coral. Infuses physical stamina, supreme courage, victory over legal adversaries, and dissolves Manglik dosha blocks.",
    price: 12500,
    rating: 4.7,
    color: "orange",
    imageUrl: "https://images.unsplash.com/photo-1569397240129-9e4811a2f6fb?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Soaked in copper vessel water overnight, activated on Mars' Tuesday with Mangal Beej chanting."
  },
  {
    id: "gem_pearl",
    name: "Basra Lustrous White Pearl (Moti)",
    sanskritName: "मोती (Moti)",
    category: "Organic Gemstone",
    graha: "Moon (Chandra)",
    description: "A flawless, spherical natural Pearl with an iridescent silvery mantle aura. Induces deep emotional calmness, sound sleep patterns, and stabilizes overactive thoughts.",
    price: 18500,
    rating: 4.8,
    color: "white",
    imageUrl: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=400",
    energizationRitual: "Bathed in fresh coconut water and energized on a Full Moon night (Purnima) with Chandra Dhyana Stotram."
  }
];

export const WISDOM_ARTICLES = [
  {
    title: "The Physics of Astral Vibrations",
    subtitle: "How gemstones interact with your body's energy core",
    author: "Dr. Kaustubh Shastri",
    desc: "Vedic science details that crystals act as astronomical energy prisms. Each astrological planet emits colored electromagnetic rays. When a planet is weak in a finder's Kundali, wearing the specific gemstone acts as a natural terrestrial lens, reflecting that missing cosmic wavelength directly into the seeker's biological nervous pathway via the skin."
  },
  {
    title: "Chakras & The Seven Great Grahas",
    subtitle: "Harmonizing planetary transits and internal alignments",
    author: "Aacharya Priya Dev",
    desc: "The 7 Chakras mapped along the Sushumna Nadi correspond exactly with the 7 physical Grahas of Parashara astrology. For example, the Solar Plexus (Manipura) is ruled by Jupiter (Guru), representing intelligence and digestion, whereas the Heart (Anahata) is ruled by Mercury (Budh) and Venus (Shukra), representing compassion and relationships. Activating the chakra directly mends planetary afflictions."
  },
  {
    title: "Pran Pratishtha: The Ancient Ritual of Life-Giving",
    subtitle: "Why certification of a gemstone is only half the battle",
    author: "Pandit Ramachandra Bhatt",
    desc: "A raw stone dug from deep beneath the crust is spiritually dormant or carries chaotic earth stresses. Consecrating it via 'Pran Pratishtha' (infusion of Prana) involves meticulous bathing in 5 nectars (Panchamrit), continuous sound alignment through copper resonance bells, and setting a specific seeker's personal intention before the ring first graces their finger."
  }
];

export const MOCK_REMARKS = [
  "Breathe deeply, seeker of light; the stars show that your current alignment is nearing peak resonance.",
  "Sudarshana chakra spins in harmony. Focus heavily on green and gold spectrums this Friday.",
  "A magnificent aura of Cosmic Violet surrounds your crown. Wisdom is knocking on your spiritual door.",
  "Your Kundali indicates that Rahu's fog is beginning to lift. Ground your feet with Suryanamaskar.",
  "Consider performing a small water offering (Arghya) to Surya Dev tomorrow morning for success."
];
