export interface Chakra {
  name: string;
  sanskrit: string;
  status: string;
  analysis: string;
}

export interface RecommendedGemstone {
  name: string;
  sanskrit: string;
  colorClass: string;
  graha: string;
  benefits: string;
  ritualMethod: string;
  approxPrice: string;
}

export interface GemstoneReading {
  prediction: string;
  energyAuraColor: string;
  chakras: Chakra[];
  recommendedGemstones: RecommendedGemstone[];
  transitBalanceScore: number;
  remedialRitual: string;
}

export interface KundaliHouse {
  house: number;
  sign: string;
  planets: string[];
}

export interface KundaliAstrology {
  title: string;
  text: string;
}

export interface KundaliData {
  ascendant: string;
  nakshatra: string;
  mahadasha: string;
  chartData: KundaliHouse[];
  readings: KundaliAstrology[];
  remedy: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ShopItem {
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  graha: string;
  description: string;
  price: number;
  rating: number;
  color: string;
  imageUrl: string;
  energizationRitual: string;
}
