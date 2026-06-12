import { useState, useEffect, FormEvent } from "react";
import {
  Sparkles,
  User,
  Compass,
  Heart,
  Briefcase,
  DollarSign,
  ShieldAlert,
  Flame,
  Eye,
  BookOpen,
  Info,
  Calendar,
  Clock,
  MapPin,
  ShoppingBag,
  Send,
  Star,
  CheckCircle,
  HelpCircle,
  Cpu,
  RefreshCw,
  Gem,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";
import {
  Chakra,
  RecommendedGemstone,
  GemstoneReading,
  KundaliData,
  ShopItem
} from "./types";
import { CHAKRAS_INFO, SHOP_ITEMS, WISDOM_ARTICLES } from "./data";
import InteractiveChakraDiagram from "./components/InteractiveChakraDiagram";
import AuraPanditChat from "./components/AuraPanditChat";

export default function App() {
  // Navigation Tabs: 'alignment', 'kundali', 'shop', 'about'
  const [activeTab, setActiveTab] = useState<"alignment" | "kundali" | "shop" | "about">("alignment");

  // Form states for Chakra aligned gemstone request
  const [seekerName, setSeekerName] = useState("");
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [primaryIntention, setPrimaryIntention] = useState<string>("");
  const [deepenIntent, setDeepenIntent] = useState("");
  const [ritualBudget, setRitualBudget] = useState<number>(5000);

  // Result state for Gemstone recommendation
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [gemstoneReading, setGemstoneReading] = useState<GemstoneReading | null>(null);

  // Form states for birth Kundali casting
  const [kundaliName, setKundaliName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [astrologyFocus, setAstrologyFocus] = useState("general");
  const [isLoadingKundali, setIsLoadingKundali] = useState(false);
  const [kundaliReading, setKundaliReading] = useState<KundaliData | null>(null);

  // Shop states
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>("all");
  const [selectedGemItem, setSelectedGemItem] = useState<ShopItem | null>(null);
  const [purchasedMessage, setPurchasedMessage] = useState<string | null>(null);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Quick link to trigger the swami chat via window click
  const openConsultation = () => {
    setActiveTab("alignment");
    const chatBtn = document.getElementById("pandit-floating-btn");
    if (chatBtn) {
      chatBtn.click();
    }
  };

  // Safe preset loading in case of backend issues
  const castMockGemstoneReading = () => {
    const chakraItem = CHAKRAS_INFO.find((c) => c.name === selectedChakra) || CHAKRAS_INFO[3];
    const generatedReading: GemstoneReading = {
      prediction: `Blessings upon you, ${seekerName || "seeker"}. The celestial grid reveals a significant alignment of planets under your intent of ${primaryIntention || "Growth"}. Currently, your ${chakraItem.name} Chakra (${chakraItem.sanskrit}) is experiencing blockages due to the transits of Shani (Saturn) and Ketu. By donning the sacred stones of the earth, you can balance these severe astral currents.`,
      energyAuraColor: selectedChakra === "Root" ? "Glowing Ruby Crimson" : selectedChakra === "Heart" ? "Lush Emerald Forest" : "Radiant Golden Astral Shimmer",
      chakras: [
        {
          name: chakraItem.name,
          sanskrit: chakraItem.sanskrit,
          status: "Severely Afflicted",
          analysis: `Your focus on ${primaryIntention || "harmony"} is being pulled down by terrestrial doubts. Activating this center with dedicated gemstone resonance allows your nervous network to transmit positive karma.`
        },
        {
          name: "Solar Plexus",
          sanskrit: "Manipura",
          status: "Underactive",
          analysis: "Stomach fire requires golden dust. Fortifying your Jupiter position improves executive luck."
        }
      ],
      recommendedGemstones: [
        {
          name: selectedChakra === "Heart" ? "Columbia Emerald" : selectedChakra === "Root" ? "Natural Burmese Ruby" : "Ceylon Yellow Sapphire",
          sanskrit: selectedChakra === "Heart" ? "Panna" : selectedChakra === "Root" ? "Manik" : "Pukhraj",
          colorClass: selectedChakra === "Heart" ? "green" : selectedChakra === "Root" ? "red" : "yellow",
          graha: selectedChakra === "Heart" ? "Mercury (Budh)" : selectedChakra === "Root" ? "Sun (Surya)" : "Jupiter (Guru)",
          benefits: "Induces heavy financial gain, restores vital self-worth, and cures speech impediments.",
          ritualMethod: `Purify the stone in raw milk and Ganges water. Recite the corresponding Beej Mantra 108 times on a serene morning before wearing the gemstone on your right ring finger.`,
          approxPrice: `₹${(ritualBudget * 0.75).toLocaleString("en-IN")}`
        }
      ],
      transitBalanceScore: 78,
      remedialRitual: `Perform 'Arghya' (water offering) to the morning Sun whilst chanting 'Om Hram Hreem Hroum Sah Suryaya Namaha' to instantly bolster solar rays.`
    };
    setGemstoneReading(generatedReading);
  };

  // Submit gemstone alignment form
  const handleRevealStones = async () => {
    if (!seekerName) {
      alert("Please enter your name to align your name-sound vibration with the earth.");
      return;
    }
    if (!primaryIntention) {
      alert("Please select a Primary Intention to direct the astral light.");
      return;
    }
    
    setIsLoadingRecommendation(true);
    setGemstoneReading(null);

    // Dynamic timeout loading effect
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const response = await fetch("/api/recommend-gemstones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: seekerName,
          intention: primaryIntention,
          deepenIntent: deepenIntent,
          budget: ritualBudget,
          selectedChakra: selectedChakra
        })
      });

      if (!response.ok) {
        throw new Error("Local transit link congested");
      }

      const data = await response.json();
      setGemstoneReading(data);
    } catch (err) {
      console.warn("Server API failed or missing key – casting traditional mock reading locally:", err);
      castMockGemstoneReading();
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // Submit Kundali birth form
  const handleCastKundali = async (e: FormEvent) => {
    e.preventDefault();
    if (!kundaliName || !birthDate) {
      alert("Please provide Seeker's Name and Date of Birth to commence astrological casting.");
      return;
    }

    setIsLoadingKundali(true);
    setKundaliReading(null);

    // Simulate astronomical calculations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await fetch("/api/kundali-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: kundaliName,
          dob: birthDate,
          tob: birthTime,
          pob: birthPlace,
          currentFocus: astrologyFocus
        })
      });

      if (!response.ok) {
        throw new Error("Celestial server congested");
      }

      const data = await response.json();
      setKundaliReading(data);
    } catch (err) {
      console.warn("Express Kundali route failed – providing simulated Parashara planetary positions:", err);
      // Fallback
      setKundaliReading({
        ascendant: "Leo (Simha)",
        nakshatra: "Magha (Ketu-ruled)",
        mahadasha: "Rahu-Jupiter (Guru)",
        chartData: [
          { house: 1, sign: "Leo", planets: ["Asc"] },
          { house: 2, sign: "Virgo", planets: ["Su", "Me"] },
          { house: 5, sign: "Sagittarius", planets: ["Ju"] },
          { house: 7, sign: "Aquarius", planets: ["Sa"] },
          { house: 10, sign: "Taurus", planets: ["Mo", "Ve"] },
          { house: 11, sign: "Gemini", planets: ["Ra"] }
        ],
        readings: [
          {
            title: "Surya-Meha in 2nd House of Wealth",
            text: "Your solar ruler is sitting excellently with Mercury, forming a supreme 'Budhaditya Yoga'. This indicates a strong legacy of intelligence and vocal charm leading to high financial success, but calls for wearing a pure Colombian Emerald to prevent family friction."
          },
          {
            title: "Shani Aspecting the 7th House",
            text: "Saturn occupies his own house in Aquarius, introducing mature, solid partnership bonds. However, minor delays are predicted. Grounding your actions on Saturdays secures your business stability."
          }
        ],
        remedy: "Carry a pure 6.2 carat green Emerald ring and offer black mustard seeds to a sacred flame."
      });
    } finally {
      setIsLoadingKundali(false);
    }
  };

  // Subscribe Newsletter
  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E0D8D0] flex flex-col relative overflow-x-hidden">
      
      {/* Decorative cosmic smoke layer and particles */}
      <div className="fixed inset-0 z-[-1] bg-radial from-[#141414] via-[#0F0F0F] to-[#0F0F0F] opacity-90"></div>
      <div className="fixed inset-0 z-[-1] opacity-5 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Golden double-ruled Celestial Top Navbar */}
      <nav className="bg-[#141414]/90 backdrop-blur-md fixed top-0 left-0 w-full z-40 border-b border-soft shadow-lg">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#e6c364]/60 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => { setActiveTab("alignment"); setGemstoneReading(null); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Skeuomorphic visual golden logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#E0D8D0] to-[#C5A059] flex items-center justify-center font-bold text-[#0F0F0F] text-xl shadow-[0_0_12px_rgba(197,160,89,0.3)] group-hover:scale-105 transition-transform duration-300">
              ॐ
            </div>
            <div>
              <span className="font-accent text-lg sm:text-2xl font-bold tracking-widest text-[#C5A059]">
                Humara Pandit
              </span>
              <p className="text-[9px] font-sans tracking-wide text-slate-400 capitalize -mt-1 hidden sm:block">
                Ancient stargazing & elemental gemstones
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 font-accent text-xs tracking-widest uppercase font-semibold">
            <li>
              <button
                onClick={() => { setActiveTab("alignment"); setGemstoneReading(null); }}
                className={`transition-colors duration-300 pb-1 border-b ${
                  activeTab === "alignment"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-slate-400 hover:text-[#E0D8D0] border-transparent"
                }`}
              >
                Chakras & Gems
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("kundali")}
                className={`transition-colors duration-300 pb-1 border-b ${
                  activeTab === "kundali"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-slate-400 hover:text-[#E0D8D0] border-transparent"
                }`}
              >
                Kundali Chart
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("shop")}
                className={`transition-colors duration-300 pb-1 border-b ${
                  activeTab === "shop"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-slate-400 hover:text-[#E0D8D0] border-transparent"
                }`}
              >
                Sacred Shop
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("about")}
                className={`transition-colors duration-300 pb-1 border-b ${
                  activeTab === "about"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-slate-400 hover:text-[#E0D8D0] border-transparent"
                }`}
              >
                Vedic Wisdom
              </button>
            </li>
          </ul>

          {/* Consultation CTA button */}
          <div className="flex items-center gap-4">
            <button
              onClick={openConsultation}
              className="bg-[#141414] border border-[#C5A059] text-[#C5A059] px-5 py-2 rounded-lg font-accent text-xs uppercase tracking-widest font-bold hover:bg-[#C5A059] hover:text-[#0F0F0F] transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.15)] btn-shimmer cursor-pointer active:scale-95"
            >
              Consult Now
            </button>
          </div>

        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow pt-[110px] pb-16 px-4 max-w-7xl w-full mx-auto relative z-10">

        {/* ==================== TAB 1: SACRED INTENT AND CHAKRA ALIGNMENT ==================== */}
        {activeTab === "alignment" && (
          <div className="space-y-12">
            
            {/* Header section */}
            <header className="text-center max-w-3xl mx-auto space-y-3 animate-fade-in-up">
              <span className="font-accent text-xs tracking-widest text-[#C5A059] uppercase block font-medium">
                ✦ Astrological Remedy Portal ✦
              </span>
              <h1 className="font-display text-3xl sm:text-5xl text-[#C5A059] drop-shadow-[0_0_15px_rgba(197,160,89,0.25)] text-gold-gradient">
                Chakra &amp; Sacred Intent
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#E0D8D0] leading-relaxed max-w-2xl mx-auto opacity-90">
                Align your internal energies with the resonant stones of the Earth. Select your focus to begin the cosmic alignment.
              </p>
              
              {/* Gold dust divider */}
              <div className="w-40 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto pt-2"></div>
            </header>

            {/* If Recommendation Result is Loaded */}
            {gemstoneReading ? (
              <section className="bg-[#141414] border border-soft rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-fade-in-up relative overflow-hidden">
                
                {/* Background decorative mandalas */}
                <div className="absolute right-4 top-4 w-32 h-32 text-white/5 opacity-5 pointer-events-none">
                  <Cpu className="w-full h-full animate-spin-slow" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                  
                  {/* Left read block: Basic analysis */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Seeker aura header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soft pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-accent text-[#C5A059]">Astrological Diagnosis for</span>
                        <h2 className="font-display text-2xl text-[#E0D8D0]">{seekerName}</h2>
                      </div>
                      <div className="flex items-center gap-2 bg-[#0F0F0F] border border-soft px-3 py-1.5 rounded-lg">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#8E2E1A] to-[#C5A059] animate-pulse"></span>
                        <span className="font-sans text-xs text-[#E0D8D0]">
                          Aura: <strong className="text-[#C5A059]">{gemstoneReading.energyAuraColor}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Overall prediction */}
                    <div className="bg-[#1A1A1A] rounded-xl p-5 border border-dashed border-[#C5A059]/30 space-y-2">
                      <h3 className="font-accent text-xs tracking-wider text-[#C5A059] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Pandit Ji's Divine Insight
                      </h3>
                      <p className="font-sans text-sm text-[#E0D8D0]/90 leading-relaxed italic">
                        &ldquo;{gemstoneReading.prediction}&rdquo;
                      </p>
                    </div>

                    {/* Highly Recommended Gemstones */}
                    <div className="space-y-4">
                      <h3 className="font-accent text-sm tracking-widest text-[#C5A059] uppercase border-b border-soft pb-2">
                        ✦ Personalized Astrological Gemstones
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gemstoneReading.recommendedGemstones.map((gem, index) => (
                          <div 
                            key={index} 
                            className="bg-[#1A1A1A] border border-soft rounded-xl p-4 flex flex-col justify-between hover:border-[#C5A059] transition-all"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-accent text-xs tracking-wider text-[#C5A059]">
                                  {gem.graha} Consecration
                                </span>
                                <span className="bg-[#8E2E1A] text-[#E0D8D0] font-accent text-[9px] px-2 py-0.5 rounded-full uppercase border border-soft">
                                  {gem.sanskrit}
                                </span>
                              </div>
                              <h4 className="font-display text-xl text-[#E0D8D0] mt-1 flex items-center gap-2">
                                <Gem className="w-5 h-5 text-[#8CA685]" /> {gem.name}
                              </h4>
                              <p className="font-sans text-xs text-slate-350 mt-2 leading-relaxed">
                                <strong>Vedic Essence:</strong> {gem.benefits}
                              </p>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-soft flex justify-between items-center">
                              <span className="font-mono text-xs text-rose-400 font-bold">
                                Value: {gem.approxPrice}
                              </span>
                              <button 
                                onClick={() => {
                                  setSelectedShopCategory("all");
                                  setActiveTab("shop");
                                }}
                                className="text-[10px] font-accent tracking-wider text-[#C5A059] hover:underline flex items-center gap-1 uppercase"
                              >
                                View cert shop <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chakras Detail list */}
                    <div className="space-y-3">
                      <h3 className="font-accent text-xs tracking-widest text-[#C5A059] uppercase">
                        ✦ Energy Vortex Balance Check
                      </h3>
                      <div className="space-y-2">
                        {gemstoneReading.chakras.map((chk, i) => (
                          <div key={i} className="bg-[#1A1A1A] border border-soft rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <span className="font-sans font-bold text-xs text-[#E0D8D0]">
                                {chk.name} Chakra <span className="text-xs font-normal text-slate-500">({chk.sanskrit})</span>
                              </span>
                              <p className="text-xs text-slate-400 font-sans mt-0.5">
                                {chk.analysis}
                              </p>
                            </div>
                            <span className="bg-rose-950/40 text-rose-300 border border-thin border-rose-900 text-[10px] font-accent px-2.5 py-0.5 rounded-full capitalize self-start sm:self-center">
                              {chk.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right side block: Transit Sun Arc and Remedial Rituals */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                    
                    {/* Semi-circular Sun Progress Orbit Arc */}
                    <div className="bg-[#1A1A1A] rounded-xl p-6 border border-soft flex flex-col items-center">
                      <span className="font-accent text-[11px] tracking-widest text-[#C5A059] uppercase block text-center mb-4">
                        Planetary Orbit Balance
                      </span>
                      
                      {/* Semi-Circle SVG Sun Gauge */}
                      <div className="w-[180px] h-[100px] relative">
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                          {/* Semicircular grey track */}
                          <path 
                            d="M 10,48 A 40,40 0 0,1 90,48" 
                            fill="none" 
                            stroke="#242424" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                          />
                          {/* Semicircular gradient colored indicator track */}
                          <path 
                            d="M 10,48 A 40,40 0 0,1 90,48" 
                            fill="none" 
                            stroke="url(#gradient-gold)" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                            strokeDasharray="125" 
                            strokeDashoffset={125 - (125 * gemstoneReading.transitBalanceScore) / 100}
                          />
                          <defs>
                            <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8E2E1A" />
                              <stop offset="50%" stopColor="#C5A059" />
                              <stop offset="100%" stopColor="#8CA685" />
                            </linearGradient>
                          </defs>

                          {/* Sun planet indicator placement */}
                          {(() => {
                            const angleRad = Math.PI - (Math.PI * gemstoneReading.transitBalanceScore) / 100;
                            const sunX = 50 + 40 * Math.cos(angleRad);
                            const sunY = 48 - 40 * Math.sin(angleRad);
                            return (
                              <g>
                                <circle 
                                  cx={sunX} 
                                  cy={sunY} 
                                  r="5" 
                                  fill="#E0D8D0" 
                                  stroke="#C5A059" 
                                  strokeWidth="1.5" 
                                  className="animate-pulse"
                                />
                                <circle 
                                  cx={sunX} 
                                  cy={sunY} 
                                  r="9" 
                                  fill="none" 
                                  stroke="#C5A059" 
                                  strokeOpacity="0.5" 
                                  strokeWidth="0.5" 
                                />
                              </g>
                            );
                          })()}
                        </svg>
                        
                        <div className="absolute inset-x-0 bottom-0 text-center">
                          <span className="font-display text-2xl text-[#C5A059]">
                            {gemstoneReading.transitBalanceScore}%
                          </span>
                          <p className="text-[9px] font-sans text-slate-400 uppercase tracking-widest leading-none mt-1">
                            Celestial Alignment Saturation
                          </p>
                        </div>
                      </div>

                      <p className="font-sans text-xs text-slate-350 text-center leading-relaxed mt-4">
                        A score above 70% suggests your intent is highly receptive to gemstone vibration healing.
                      </p>
                    </div>

                    {/* Remedial Ritual Section */}
                    <div className="bg-[#1A1A1A] border border-soft rounded-xl p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-[#C5A059]" />
                        <h4 className="font-accent text-xs tracking-widest text-[#C5A059] uppercase font-bold">
                          Primary Astral Remedy (Karmic Pooja)
                        </h4>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-[#E0D8D0]/95 leading-relaxed">
                        {gemstoneReading.remedialRitual}
                      </p>
                      <div className="bg-[#0F0F0F]/45 p-3 rounded border border-soft text-[11px] text-[#C5A059] font-sans leading-relaxed">
                        <strong>Daily Practice Time:</strong> Performs well at Sunrise facing East for maximum solar charging.
                      </div>
                    </div>

                    {/* Reset State Action */}
                    <button
                      onClick={() => {
                        setGemstoneReading(null);
                        setSeekerName("");
                        setSelectedChakra(null);
                        setPrimaryIntention("");
                        setDeepenIntent("");
                      }}
                      className="w-full bg-[#141414] border border-soft py-3 rounded-lg font-accent text-xs uppercase tracking-widest font-bold hover:bg-white/5 text-[#E0D8D0] hover:text-[#C5A059] duration-300 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Balance Another Soul Intent
                    </button>

                  </div>

                </div>
              </section>
            ) : (
              /* Core Design Alignment Layout: Two Columns */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-fade-in-up">
                
                {/* Left Column: Interactive Diagram Component */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <InteractiveChakraDiagram 
                    onSelectChakra={setSelectedChakra}
                    selectedChakraName={selectedChakra}
                  />
                </div>

                {/* Right Column: Form Inputs */}
                <div className="lg:col-span-7 bg-[#141414] border border-soft p-6 sm:p-8 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.8)] relative text-[#E0D8D0]">
                  
                  {/* Subtle corner gemstone accent decoration */}
                  <div className="absolute top-4 right-4 w-9 h-9 bg-gradient-to-br from-[#8E2E1A] to-red-950 rounded-sm rotate-45 gem-3d opacity-25 pointer-events-none"></div>
                  
                  {/* Title frame badge */}
                  <div className="inline-block bg-[#0F0F0F] text-[#C5A059] border border-soft text-[10px] font-accent px-3 py-1 rounded-sm uppercase tracking-widest font-bold mb-6">
                    ✦ Pandit Consultation Form ✦
                  </div>

                  <div className="space-y-6">
                    
                    {/* Seeker Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="seekerNameField" className="font-accent text-[#E0D8D0] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <User className="w-4 h-4 text-[#C5A059]" /> Seeker's Full Name
                      </label>
                      <input
                        id="seekerNameField"
                        type="text"
                        value={seekerName}
                        onChange={(e) => setSeekerName(e.target.value)}
                        placeholder="e.g. Priyanshu Shastri"
                        className="bg-[#0F0F0F] border border-soft rounded-lg p-3.5 text-[#E0D8D0] font-sans font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
                      />
                    </div>

                    {/* Intention Grid Selector */}
                    <div className="flex flex-col gap-2">
                      <label className="font-accent text-[#E0D8D0] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#C5A059]" /> Primary Astro Intention
                      </label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { val: "love", label: "Love & Marriage", icon: Heart, colorClass: "text-[#8E2E1A]" },
                          { val: "career", label: "Career & Trade", icon: Briefcase, colorClass: "text-[#C5A059]" },
                          { val: "wealth", label: "Wealth Surge", icon: DollarSign, colorClass: "text-emerald-500" },
                          { val: "stress", label: "Stress Release", icon: ShieldAlert, colorClass: "text-amber-600" },
                          { val: "health", label: "Vital Health", icon: Flame, colorClass: "text-orange-605" },
                          { val: "spiritual", label: "Divine Path", icon: Eye, colorClass: "text-violet-605" },
                          { val: "focus", label: "Intellect Focus", icon: BookOpen, colorClass: "text-blue-500" },
                          { val: "protection", label: "Evil protection", icon: Info, colorClass: "text-[#E0D8D0]" }
                        ].map((item) => {
                          const IconComp = item.icon;
                          const isPicked = primaryIntention === item.val;
                          return (
                            <button
                              key={item.val}
                              onClick={() => setPrimaryIntention(item.val)}
                              className={`rounded-lg p-3 flex flex-col items-center justify-center gap-2 py-3 transition-all duration-300 cursor-pointer text-center ${
                                isPicked 
                                  ? "bg-[#1A1A1A] border-2 border-[#C5A059] shadow-[0_4px_15px_rgba(197,160,89,0.15)] scale-102 font-bold text-[#C5A059]" 
                                  : "bg-[#0F0F0F] border border-soft hover:bg-[#141414] text-[#E0D8D0]"
                              }`}
                            >
                              <IconComp className={`w-5 h-5 ${isPicked ? "text-[#C5A059] scale-110" : "text-[#E0D8D0]/60"}`} />
                              <span className="text-[11px] font-sans font-semibold tracking-tight">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Deepen Intent text area */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="deepenIntentField" className="font-accent text-[#E0D8D0] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#C5A059]" /> Deepen Your Intent (Optional)
                      </label>
                      <textarea
                        id="deepenIntentField"
                        rows={3}
                        value={deepenIntent}
                        onChange={(e) => setDeepenIntent(e.target.value)}
                        placeholder="Write blockages, Saturn cycles, health notes, or specific date wishes..."
                        className="bg-[#0F0F0F] border border-soft rounded-lg p-3.5 text-[#E0D8D0] font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all resize-none animate-none"
                      />
                    </div>

                    {/* Budget Slider */}
                    <div className="bg-[#1A1A1A] border border-soft p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gold-dust opacity-5 pointer-events-none"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <label htmlFor="ritualInvestmentRange" className="font-accent text-[#E0D8D0] font-bold text-xs uppercase tracking-widest">
                          Ritual Investment Budget
                        </label>
                        <span className="bg-[#0F0F0F] px-2 py-1 border border-soft rounded-md font-sans font-bold text-sm text-[#C5A059]">
                          {ritualBudget >= 100000 
                            ? `₹${(ritualBudget / 100000).toFixed(1)}L+` 
                            : `₹${ritualBudget.toLocaleString("en-IN")}`
                          }
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        <input
                          id="ritualInvestmentRange"
                          type="range"
                          min={500}
                          max={500000}
                          step={500}
                          value={ritualBudget}
                          onChange={(e) => setRitualBudget(Number(e.target.value))}
                          className="w-full accent-[#C5A059] h-1.5 bg-[#0F0F0F] rounded-lg cursor-pointer outline-none"
                        />
                        <div className="flex justify-between text-[10px] text-[#E0D8D0]/60 font-semibold mt-1">
                          <span>₹500</span>
                          <span>₹50K</span>
                          <span>₹2L</span>
                          <span>Disclaimer: ₹5L+ (Highest energy gems)</span>
                        </div>
                      </div>
                    </div>

                    {/* CTAs Submit Action Button */}
                    <div className="pt-3">
                      <button
                        onClick={handleRevealStones}
                        disabled={isLoadingRecommendation}
                        className="w-full relative overflow-hidden bg-[#8E2E1A] border-2 border-[#C5A059] text-[#E0D8D0] py-4 rounded-lg font-accent tracking-widest font-bold text-sm uppercase shadow-lg hover:shadow-[0_6px_25px_rgba(142,46,26,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 select-none btn-shimmer cursor-pointer"
                      >
                        {isLoadingRecommendation ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin text-[#C5A059]" />
                            Chanting Mantras & aligning orbits...
                          </>
                        ) : (
                          <>
                            <span>Reveal My Stones</span>
                            <Sparkles className="w-5 h-5 text-[#C5A059]" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: VEDIC KUNDALI GRAPH CASTING ==================== */}
        {activeTab === "kundali" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            
            <header className="text-center space-y-2">
              <span className="font-accent text-xs tracking-widest text-[#C5A059] uppercase block font-medium">
                ✦ High Precision Horoscopes ✦
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#C5A059] text-gold-gradient">
                Janam Kundali Astral Chart
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Generate your Hindu layout diagonal horoscope chart immediately. Gemini calculates planetary degrees and house allocations instantly.
              </p>
              <div className="w-24 h-0.5 bg-[#C5A059]/30 mx-auto pt-1"></div>
            </header>

            {/* Layout Wrapper Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form caster block */}
              <div className="lg:col-span-5 bg-[#141414] border border-soft p-6 rounded-2xl shadow-xl space-y-6">
                <h2 className="font-accent text-xs tracking-widest text-[#C5A059] uppercase font-bold border-b border-soft pb-2">
                  ✦ Birth Coordinates Input
                </h2>
                
                <form onSubmit={handleCastKundali} className="space-y-4 text-xs font-sans">
                  
                  <div className="space-y-1">
                    <label htmlFor="kundaliNameField" className="text-[#E0D8D0] block font-semibold mb-1">Seeker Name</label>
                    <input
                      id="kundaliNameField"
                      type="text"
                      required
                      placeholder="e.g. Sweta Iyer"
                      value={kundaliName}
                      onChange={(e) => setKundaliName(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-soft rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="birthDateField" className="text-[#E0D8D0] block font-semibold mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Date of Birth
                      </label>
                      <input
                        id="birthDateField"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-soft rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="birthTimeField" className="text-[#E0D8D0] block font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Exact Time of Birth
                      </label>
                      <input
                        id="birthTimeField"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-soft rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="birthPlaceField" className="text-[#E0D8D0] block font-semibold mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Birth State/City
                    </label>
                    <input
                      id="birthPlaceField"
                      type="text"
                      placeholder="e.g. Pune, Maharashtra"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-soft rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="astrologyFocusSelect" className="text-[#E0D8D0] block font-semibold mb-1 flex items-center gap-1">Affliction Focus Area</label>
                    <select
                      id="astrologyFocusSelect"
                      value={astrologyFocus}
                      onChange={(e) => setAstrologyFocus(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-soft rounded-lg p-3 text-slate-250 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                    >
                      <option value="general">Comprehensive General Kundali Reading</option>
                      <option value="marriage">Shadi/Marriage &amp; Manglik Dosha</option>
                      <option value="career">Dhan Yog (Wealth) &amp; Career stability</option>
                      <option value="health">Saturn Sadhesati &amp; Health alignment</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingKundali}
                    className="w-full bg-[#8E2E1A] border border-[#C5A059] py-3 rounded-lg font-accent tracking-widest text-[#E0D8D0] hover:text-white text-xs uppercase font-bold hover:bg-[#722111] transition duration-300 mt-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoadingKundali ? "Calculating Nakshatra orbits..." : "Cast My Chart Now"}
                  </button>

                </form>
              </div>

              {/* Chart drawer display / Predictions outcome */}
              <div className="lg:col-span-7">
                {kundaliReading ? (
                  <div className="bg-[#141414] border border-soft rounded-2xl p-6 space-y-6 animate-fade-in-up">
                    
                    {/* Upper Summary info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-soft pb-4 text-xs font-sans">
                      <div className="bg-[#0F0F0F] p-2.5 rounded border border-soft">
                        <span className="text-[#C5A059] block text-[9px] uppercase font-bold font-accent">Lagna (Ascendant)</span>
                        <span className="text-white text-sm font-semibold">{kundaliReading.ascendant}</span>
                      </div>
                      <div className="bg-[#0F0F0F] p-2.5 rounded border border-soft">
                        <span className="text-[#C5A059] block text-[9px] uppercase font-bold font-accent">Nakshatra Star</span>
                        <span className="text-white text-sm font-semibold">{kundaliReading.nakshatra}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 bg-[#0F0F0F] p-2.5 rounded border border-soft">
                        <span className="text-[#C5A059] block text-[9px] uppercase font-bold font-accent font-medium">Active Mahadasha</span>
                        <span className="text-[#C5A059] text-sm font-semibold">{kundaliReading.mahadasha}</span>
                      </div>
                    </div>

                    {/* Chart visual representation: Traditional North Indian Diamond SVG layout */}
                    <div className="flex flex-col items-center py-4 bg-[#0F0F0F] rounded-xl border border-dashed border-soft">
                      <span className="text-[10px] font-accent text-slate-400 uppercase tracking-widest mb-3">
                        ✦ Sacred Diamonds Kundali Grid ✦
                      </span>

                      {/* SVG Canvas block */}
                      <div className="w-[280px] h-[280px] relative">
                        <svg className="w-full h-full text-[#C5A059] drop-shadow-[0_0_4px_rgba(197,160,89,0.3)]" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="1.5">
                          {/* Square boundary */}
                          <rect x="5" y="5" width="290" height="290" />
                          {/* Diagonals */}
                          <line x1="5" y1="5" x2="295" y2="295" />
                          <line x1="295" y1="5" x2="5" y2="295" />
                          {/* Diamonds */}
                          <line x1="150" y1="5" x2="295" y2="150" />
                          <line x1="295" y1="150" x2="150" y2="295" />
                          <line x1="150" y1="295" x2="5" y2="150" />
                          <line x1="5" y1="150" x2="150" y2="5" />
                        </svg>

                        {/* Planet locations mapped in 12 houses overlay coordinates */}
                        {(() => {
                          // Define geometric centers for the 12 triangle houses
                          const centers: Record<number, { x: string; y: string; label: string }> = {
                            1: { x: "50%", y: "30%", label: "1" },      // Central top triangle
                            2: { x: "32%", y: "15%", label: "2" },      // Upper left outer
                            3: { x: "15%", y: "32%", label: "3" },      // Left top outer
                            4: { x: "30%", y: "50%", label: "4" },      // Central left
                            5: { x: "15%", y: "68%", label: "5" },      // Left bottom outer
                            6: { x: "32%", y: "85%", label: "6" },      // Lower left outer
                            7: { x: "50%", y: "70%", label: "7" },      // Central bottom triangle
                            8: { x: "68%", y: "85%", label: "8" },      // Lower right outer
                            9: { x: "85%", y: "68%", label: "9" },      // Right bottom outer
                            10: { x: "70%", y: "50%", label: "10" },    // Central right
                            11: { x: "85%", y: "32%", label: "11" },    // Right top outer
                            12: { x: "68%", y: "15%", label: "12" }     // Upper right outer
                          };

                          return Object.entries(centers).map(([houseStr, pos]) => {
                            const houseNum = Number(houseStr);
                            const info = kundaliReading.chartData.find(d => d.house === houseNum);
                            const planetsInHouse = info ? info.planets.join(", ") : "";
                            const zodiacSign = info ? info.sign : "";

                            return (
                              <div 
                                key={houseNum}
                                className="absolute flex flex-col items-center justify-center pointer-events-none"
                                style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
                              >
                                {/* Small house number */}
                                <span className="text-[10px] text-[#C5A059]/70 font-mono leading-none">
                                  {pos.label}
                                </span>
                                {/* Zodiac shorthand */}
                                {zodiacSign && (
                                  <span className="text-[9px] text-[#C5A059] opacity-75 uppercase font-sans font-semibold">
                                    {zodiacSign.substring(0, 3)}
                                  </span>
                                )}
                                {/* Placed Planets */}
                                {planetsInHouse && (
                                  <span className="text-[10.5px] text-[#E0D8D0] bg-[#141414]/90 px-1 rounded border border-soft font-bold font-sans mt-0.5 whitespace-nowrap">
                                    {planetsInHouse}
                                  </span>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Detailed readings list */}
                    <div className="space-y-4">
                      <h3 className="font-accent text-[#C5A059] text-xs uppercase tracking-widest font-bold">
                        ✦ Astro placements & forecast
                      </h3>
                      <div className="space-y-3">
                        {kundaliReading.readings.map((rd, i) => (
                          <div key={i} className="bg-[#0F0F0F]/60 p-4 rounded-xl border border-soft space-y-1">
                            <h4 className="text-[#C5A059] font-sans font-bold text-xs flex items-center gap-2">
                              <Star className="w-3.5 h-3.5 text-[#C5A059]" /> {rd.title}
                            </h4>
                            <p className="text-xs font-sans text-slate-350 leading-relaxed">
                              {rd.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Consecrating advice */}
                    <div className="bg-[#8E2E1A]/10 border border-[#8E2E1A]/40 p-4 rounded-xl space-y-1 text-xs">
                      <span className="text-[#C5A059] font-accent uppercase tracking-widest block font-bold text-[10px]">
                        Kundali Gemstone Remedy
                      </span>
                      <p className="text-slate-200 font-sans leading-relaxed">
                        {kundaliReading.remedy}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="h-[430px] rounded-2xl border border-dashed border-soft bg-[#141414]/40 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                    <Compass className="w-16 h-16 opacity-15 animate-float-slow text-[#C5A059] mb-3" />
                    <p className="font-accent text-xs tracking-widest uppercase text-slate-400">
                      Chart Placements Pending...
                    </p>
                    <p className="font-sans text-xs max-w-sm mt-1 leading-relaxed text-slate-500">
                      Cast your natal coordinates to compile standard planetary positions (12 astrological houses) and Mahadasha forecasts.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 3: CERTIFIED GEMSTONES SHOP ==================== */}
        {activeTab === "shop" && (
          <div className="space-y-8 animate-fade-in-up">
            
            <header className="text-center space-y-2">
              <span className="font-accent text-xs tracking-widest text-[#C5A059] uppercase block font-medium">
                ✦ Sacred Consecrated Stones ✦
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#C5A059] text-gold-gradient">
                Our Consecrated Gemstone Shop
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                All shop elements undergo authentic 5-nectar Puja baths and Pran Pratishtha chanting on the banks of holy rivers before shipment.
              </p>
              <div className="w-24 h-0.5 bg-[#C5A059]/30 mx-auto pt-1"></div>
            </header>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 font-accent text-[10px] tracking-widest font-bold uppercase">
              {[
                { id: "all", label: "All Items" },
                { id: "Precious Gemstone", label: "Precious Gems" },
                { id: "Organic Gemstone", label: "Organic/Vedic" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedShopCategory(cat.id)}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    selectedShopCategory === cat.id 
                      ? "bg-[#C5A059] text-[#0F0F0F] border-[#C5A059]" 
                      : "bg-[#141414] text-[#E0D8D0] border-soft hover:border-[#C5A059]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOP_ITEMS
                .filter(item => selectedShopCategory === "all" || item.category === selectedShopCategory)
                .map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#141414] border border-soft rounded-xl overflow-hidden hover:border-[#C5A059] transition-all flex flex-col justify-between shadow-lg"
                  >
                    
                    {/* Gemstone Image frame */}
                    <div className="h-44 w-full relative overflow-hidden bg-stone-950 border-b border-soft group">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-[#0F0F0F]/85 text-[#C5A059] text-[9px] font-accent px-2.5 py-1 rounded border border-soft font-bold uppercase">
                        {item.graha}
                      </div>
                    </div>

                    {/* Detail block */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-[#C5A059] font-accent uppercase font-bold">
                          <span>{item.category}</span>
                          <span>{item.sanskritName}</span>
                        </div>
                        <h3 className="font-display text-xl text-[#E0D8D0] leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-sans text-xs text-slate-350 leading-relaxed font-sans line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Display pricing / click details button */}
                      <div className="pt-3 border-t border-soft flex items-center justify-between">
                        <span className="font-sans text-[#C5A059] font-bold text-sm">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        
                        <button
                          onClick={() => setSelectedGemItem(item)}
                          className="bg-[#8E2E1A] border border-soft text-[#E0D8D0] px-3.5 py-1.5 rounded text-xs font-accent uppercase tracking-widest font-semibold hover:bg-[#C5A059] hover:text-[#0F0F0F] transition-all cursor-pointer"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>

            {/* PURCHASE MODAL / CONSECRATION PROCESS */}
            {selectedGemItem && (
              <div className="fixed inset-0 bg-[#0F0F0F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-[#141414] border border-soft max-w-lg w-full rounded-2xl p-6 relative text-[#E0D8D0] animate-fade-in-up shadow-2xl">
                  
                  {/* Close button */}
                  <button 
                    onClick={() => {
                      setSelectedGemItem(null);
                      setPurchasedMessage(null);
                    }}
                    className="absolute top-4 right-4 text-[#E0D8D0] hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="space-y-4 font-sans">
                    <span className="font-accent text-[10px] tracking-widest uppercase text-[#C5A059] block font-bold">
                      ✦ SACRED GEMSTONE ACQUISITION ✦
                    </span>
                    <h2 className="font-display text-2xl text-[#E0D8D0] leading-tight-none border-b border-soft pb-2">
                      {selectedGemItem.name}
                    </h2>

                    {purchasedMessage ? (
                      <div className="bg-[#1a2d1d] text-emerald-100 border border-emerald-800 p-4 rounded-xl space-y-3 text-sm animate-fade-in-up">
                        <div className="flex items-center gap-2 font-bold text-emerald-400 select-none">
                          <CheckCircle className="w-5 h-5" /> Consecrated Order Registered!
                        </div>
                        <p className="leading-relaxed text-xs">
                          {purchasedMessage}
                        </p>
                        <p className="text-[11px] text-emerald-300 border-t border-emerald-900/50 pt-2 font-medium">
                          Hari Om! Swamiji will perform your special Pran Pratishtha puja during tomorrow morning's transit hours.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-[#0F0F0F] p-4 rounded-lg border border-soft text-xs space-y-2">
                          <p className="leading-relaxed text-[#C5A059] font-semibold">
                            Pran Consecration Ritual Detail:
                          </p>
                          <p className="text-[#E0D8D0]/80 leading-relaxed italic">
                            {selectedGemItem.energizationRitual}
                          </p>
                        </div>

                        <div className="border-t border-soft pt-4 flex flex-col gap-2 font-semibold text-xs">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Certified Gemstone Cost:</span>
                            <span className="text-[#C5A059]">₹{selectedGemItem.price.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 font-normal">
                            <span>Vedic Puja & Pooja Materials:</span>
                            <span className="text-emerald-400 font-medium">Included (₹0 Free Blessing)</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-dashed border-soft pt-2 font-bold">
                            <span>Total Celestial Offering:</span>
                            <span className="text-[#C5A059]">₹{selectedGemItem.price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {/* Order button trigger */}
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setPurchasedMessage(
                                `The celestial vibrations are aligned! We have registered your name sound to execute Prasad offerings on the banks of Ganges. A customized tracking document detailing your gemstones scientific lab certification number (GLI accredited) and specific hour of Pran Pratishtha puja is dispatched to your coordinates.`
                              );
                            }}
                            className="w-full bg-[#8E2E1A] border border-[#C5A059] text-[#E0D8D0] py-3 rounded-lg font-accent text-xs tracking-widest font-bold uppercase hover:bg-[#C5A059] hover:text-[#0F0F0F] transition-all cursor-pointer"
                          >
                            Proceed with Pooja Consecration & Shipping
                          </button>
                        </div>
                      </>
                    )}

                    <div className="text-center pt-2">
                      <span className="text-[9px] font-accent text-slate-500 uppercase tracking-widest font-medium">
                        ✦ Protected &amp; Certified by Hindu Temple Standards ✦
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 4: VEDIC WISDOM SCRIPTS ==================== */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up text-xs sm:text-sm font-sans text-slate-300">
            
            <header className="text-center space-y-2">
              <span className="font-accent text-xs tracking-widest text-[#C5A059] uppercase block font-medium">
                ✦ Eternal Granthas &amp; Shastras ✦
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#C5A059] text-gold-gradient">
                Celestial Wisdom Library
              </h1>
              <p className="font-sans text-slate-300 max-w-lg mx-auto">
                Discover the deep physics of astrological wavelengths, gemstone composition, and traditional energization methods as recorded in Atharva Veda.
              </p>
              <div className="w-24 h-0.5 bg-[#C5A059]/30 mx-auto pt-1"></div>
            </header>

            {/* Articles List */}
            <div className="space-y-6">
              {WISDOM_ARTICLES.map((art, i) => (
                <article key={i} className="bg-[#141414] border border-soft rounded-2xl p-6 space-y-3 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-soft pb-2">
                    <div>
                      <span className="text-[9px] uppercase font-accent text-[#C5A059] font-bold tracking-wider">{art.subtitle}</span>
                      <h2 className="font-display text-xl text-[#E0D8D0] mt-0.5">{art.title}</h2>
                    </div>
                    <span className="text-[10px] font-accent text-slate-500 uppercase tracking-tight italic select-none">
                      by {art.author}
                    </span>
                  </div>

                  <p className="text-slate-350 leading-relaxed font-sans text-xs sm:text-sm">
                    {art.desc}
                  </p>
                </article>
              ))}
            </div>

            {/* Chakra Table Information */}
            <section className="bg-[#141414] border border-soft rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="font-accent text-xs tracking-widest text-[#C5A059] uppercase border-b border-soft pb-2">
                ✦ The Seven Chakra Vedic Guide
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-soft text-[#C5A059] font-semibold text-[10px] font-accent tracking-wider uppercase">
                      <th className="py-2.5 px-2">Chakra</th>
                      <th className="py-2.5 px-2">Sanskrit</th>
                      <th className="py-2.5 px-2">Cosmic Element</th>
                      <th className="py-2.5 px-2">Seed Mantra</th>
                      <th className="py-2.5 px-2">Primary Gemstones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHAKRAS_INFO.map((chk, i) => (
                      <tr key={i} className="border-b border-soft/5 hover:bg-white/5 transition-all">
                        <td className="py-2 px-2 font-bold text-white flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chk.color }} />
                          {chk.name}
                        </td>
                        <td className="py-2 px-2 italic text-[#E0D8D0]/80">{chk.sanskrit}</td>
                        <td className="py-2 px-2 text-slate-400">{chk.element}</td>
                        <td className="py-2 px-2 font-mono text-[#C5A059] font-bold">{chk.mantra}</td>
                        <td className="py-2 px-2 text-slate-350 italic">{chk.gems}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* Speech Bubble Swamiji Mascot & Chat integration */}
      <AuraPanditChat />

      {/* Full Altar Footer */}
      <footer className="bg-[#141414] text-[#E0D8D0] py-12 px-6 border-t border-soft relative mt-auto z-10 overflow-hidden">
        
        {/* Ancient Mandala Separator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#C5A059] opacity-10 flex justify-center items-center pointer-events-none">
          <Cpu className="w-full h-full animate-spin-slow" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Editorial Description */}
          <div className="space-y-3">
            <h3 className="font-accent text-sm tracking-widest font-bold text-[#C5A059]">
              HUMARA PANDIT
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              Guiding seekers through ancient cosmic wisdom and the sacred resonance of elemental energies. Connect your soul to earthly alignments safely.
            </p>
          </div>

          {/* Column 2: Sacred Services */}
          <div className="space-y-2 text-xs font-sans">
            <h4 className="font-accent text-[11px] tracking-wider uppercase font-bold border-b border-soft pb-1 text-[#E0D8D0]">
              Sacred Services
            </h4>
            <ul className="space-y-1.5 text-slate-400 font-medium">
              <li>
                <button onClick={() => { setActiveTab("alignment"); setGemstoneReading(null); }} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  ✦ Gemstone Recommendation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("kundali")} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  ✦ Kundali Reading Caster
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("alignment"); setGemstoneReading(null); }} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  ✦ Chakra Balancing Alignments
                </button>
              </li>
              <li>
                <button onClick={openConsultation} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  ✦ Real-time Pandit Guidance
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Celestial Wisdom links */}
          <div className="space-y-2 text-xs font-sans">
            <h4 className="font-accent text-[11px] tracking-wider uppercase font-bold border-b border-soft pb-1 text-[#E0D8D0]">
              Celestial Wisdom
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  Vedic Crystal Physics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  The Science of Grahas
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  Pran Pratishtha Method
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("shop")} className="hover:text-[#C5A059] hover:underline cursor-pointer">
                  Certified Gemstone Laboratory
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="font-accent text-[11px] tracking-wider uppercase font-bold border-b border-soft pb-1 text-[#E0D8D0]">
              Stay Aligned
            </h4>
            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              Receive cosmic transits advice and holy temple offerings straight in your spiritual inbox.
            </p>
            
            {isSubscribed ? (
              <div className="bg-[#1a2d1d] text-emerald-350 p-2.5 rounded text-[11px] font-sans font-bold border border-emerald-900/50 leading-normal animate-pulse">
                Peace & blessings upon you! Checked for weekly updates. (Om Shanti!)
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-1.5 pt-1">
                <input 
                  type="email" 
                  required
                  placeholder="name@seeker.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#0F0F0F] border border-soft px-3 py-1.5 rounded-md text-xs placeholder:text-slate-600 focus:outline-[#C5A059] w-full text-slate-200"
                />
                <button 
                  type="submit"
                  className="bg-[#0F0F0F] text-[#C5A059] border border-soft hover:bg-[#C5A059] hover:text-[#0F0F0F] px-3.5 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Divider line symbol */}
        <div className="border-t border-soft pt-6 flex flex-col md:flex-row justify-between items-center gap-3 max-w-7xl mx-auto text-center font-sans text-xs text-slate-500 relative">
          <div className="absolute left-1/2 -top-4.5 -translate-x-1/2 bg-[#0F0F0F] border border-soft rounded-full px-4 py-1 font-accent text-xs tracking-wider text-[#C5A059] opacity-80">
            ✦ ~ OM SHANTI ~ ✦
          </div>
          <p>© 2026 Humara Pandit. Guided by the Heavens and Vedic Ancestors.</p>
          <ul className="flex gap-4 font-semibold text-[10px] font-accent uppercase tracking-widest text-[#C5A059]">
            <li>
              <a href="#" className="hover:text-amber-200 transition-colors">Sacred Privacy</a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-200 transition-colors">Celestial Terms</a>
            </li>
          </ul>
        </div>

      </footer>

    </div>
  );
}
