import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client with security and error checks
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets panel. Please configure it.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// REST Endpoint: Get Gemstone & Chakra Predictions
app.post("/api/recommend-gemstones", async (req, res) => {
  try {
    const { name, intention, deepenIntent, budget } = req.body;
    if (!name || !intention) {
      return res.status(400).json({ error: "Seeker's Name and Primary Intention are required." });
    }

    const ai = getGeminiClient();
    const prompt = `
      You are a wise and theatrical Vedic Astrologer (Pandit Ji) and Gemstone Mystic from the sacred temple of Hampi.
      Perform a highly personalized, unique, and spiritually profound reading for:
      - Seeker's Name: ${name}
      - Primary Intention: ${intention}
      - Deepened Intent / Blockages or Hopes: ${deepenIntent || "None provided"}
      - Ritual Investment Budget Limit: ₹${budget || "5000"}

      Return a response detailing their energetic state, custom Chakra analysis, and recommendation of 1-2 powerful astrological gemstones matchable within the budget, and a deep remedial ritual. Include planet (Graha) transits affecting this state. Use rich spiritual vocabulary.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a legendary ancient Hindu astrologer who channels cosmic stargazing and chakra science. Be theatrical, highly wise, profound, encouraging, and authentic.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: {
              type: Type.STRING,
              description: "Profound spiritual overview of the seeker's current energy state and current planetary transits."
            },
            energyAuraColor: {
              type: Type.STRING,
              description: "The seeker's current dominant aura color (e.g. Glowing Amber, Cosmic Violet)."
            },
            chakras: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the Chakra (e.g. Heart, Third Eye)" },
                  sanskrit: { type: Type.STRING, description: "Sanskrit name (e.g. Anahata, Ajna)" },
                  status: { type: Type.STRING, description: "Energetic status (e.g. Overactive, Blocked, Harmonized)" },
                  analysis: { type: Type.STRING, description: "Deeper explanation of how this reflects in their current intention." }
                },
                required: ["name", "sanskrit", "status", "analysis"]
              }
            },
            recommendedGemstones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the gemstone (e.g. Emerald, Ruby, Blue Sapphire)" },
                  sanskrit: { type: Type.STRING, description: "Sanskrit name (e.g. Panna, Manik, Neelam)" },
                  colorClass: { type: Type.STRING, description: "The visual color (e.g. green, red, blue)" },
                  graha: { type: Type.STRING, description: "Ruling planet (e.g. Rahu, Surya, Ketu, Shani)" },
                  benefits: { type: Type.STRING, description: "Spiritual, career or physical healing benefits." },
                  ritualMethod: { type: Type.STRING, description: "How to wear or pray with it (mantras to recite, specific weekday, time)." },
                  approxPrice: { type: Type.STRING, description: "Approximate fair market price in Rupees (aligned with budget: " + budget + ")" }
                },
                required: ["name", "sanskrit", "colorClass", "graha", "benefits", "approxPrice"]
              }
            },
            transitBalanceScore: {
              type: Type.INTEGER,
              description: "Percentage score (0-100) on planetary orbital balance."
            },
            remedialRitual: {
              type: Type.STRING,
              description: "A profound ritual or seed mantra dedicated to balancing their dominant blocked energies."
            }
          },
          required: ["prediction", "energyAuraColor", "chakras", "recommendedGemstones", "transitBalanceScore", "remedialRitual"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemstone Recommendation Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during the cosmic casting." });
  }
});

// REST Endpoint: Kundali and Birth Chart Astrological Casting
app.post("/api/kundali-reading", async (req, res) => {
  try {
    const { name, dob, tob, pob, currentFocus } = req.body;
    if (!name || !dob) {
      return res.status(400).json({ error: "Seeker's Name and Date of Birth are required." });
    }

    const ai = getGeminiClient();
    const prompt = `
      Perform a deep Vedic Janam Kundali chart translation and horoscope reading for:
      - Seeker Name: ${name}
      - Birth Date: ${dob}
      - Birth Time: ${tob || "Unknown / sunrise"}
      - Birth Place: ${pob || "Unknown"}
      - Current Life Focus: ${currentFocus || "All spheres"}

      Calculate the Ascendant sign (Lagna), placements of Key Planets (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu) in houses, the current Mahadasha period, and Vedic forecasts. Design simulated coordinates and house planetary arrays for a visual North Indian Kundali Chart (12 diamond/triangle houses numbered 1 to 12 with list of planets in each).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an absolute authority on parashara astrology, planetary positions of constellations (Nakshatras), and transit charts. Return a comprehensive structured JSON response.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ascendant: { type: Type.STRING, description: "Lagna / Ascendant Sign name" },
            nakshatra: { type: Type.STRING, description: "Birth Star / Nakshatra (e.g. Purva Phalguni)" },
            mahadasha: { type: Type.STRING, description: "Current ruling planetary period (e.g. Rahu-Jupiter)" },
            chartData: {
              type: Type.ARRAY,
              description: "Planetary placements in 12 houses. Format matching a standard 12-house Kundali chart.",
              items: {
                type: Type.OBJECT,
                properties: {
                  house: { type: Type.INTEGER, description: "House number (1 to 12)" },
                  sign: { type: Type.STRING, description: "Zodiac sign occupying the house" },
                  planets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of shorthand planets e.g [Su, Me]" }
                },
                required: ["house", "sign", "planets"]
              }
            },
            readings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Topic e.g. Saturn Sadhesati, Career Outlook" },
                  text: { type: Type.STRING, description: "Profound, accurate explanation of placement implications." }
                },
                required: ["title", "text"]
              }
            },
            remedy: { type: Type.STRING, description: "Planetary gemstone or fast ritual remedy for the afflicted house planets." }
          },
          required: ["ascendant", "nakshatra", "mahadasha", "chartData", "readings", "remedy"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Kundali Reading Error:", error);
    res.status(500).json({ error: error.message || "Celestial calculations were disrupted." });
  }
});

// REST Endpoint: Aura AI Chat Consultation
app.post("/api/consultation-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "A message history array is required." });
    }

    const ai = getGeminiClient();
    
    // Transform incoming messages into Gemini contents format
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are Aura AI Pandit, a real-time spiritual, warm, encouraging, Wise Swamiji counselor. Speak beautifully using sacred advice, metaphors of Indian astrology and chakras, and help seekers feel aligned and validated. Avoid diagnosing medical issues. Suggest holy gemstones, breathing, and mantras. Keep replies relatively concise, spiritual, and conversational.",
        temperature: 0.8,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Spiritual Consultation Error:", error);
    res.status(500).json({ error: error.message || "Spritual connection timed out." });
  }
});

// Vite middleware for development or static file server for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        },
      },
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Humara Pandit] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
