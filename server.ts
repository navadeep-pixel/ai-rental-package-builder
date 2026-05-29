import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized AI
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in Settings > Secrets in Google AI Studio.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// REST API for package suggestions
app.post("/api/generate-packages", async (req, res) => {
  try {
    const {
      usecase,
      people,
      budget,
      currency = "INR",
      duration,
      location,
      level,
      requirements,
    } = req.body;

    if (!usecase) {
      return res.status(400).json({ error: "Use case / event description is required" });
    }

    const ai = getAI();

    const systemPrompt = `You are an elite, highly experienced AI Rental Package Builder for an equipment rental company. Your role is to analyze a customer's specific needs and formulate exactly 3 custom rental packages: Basic, Recommended, and Premium.
Your suggestions should cover the real, practical physical gear needed for their use-case (e.g., AV sound, photo/video cameras, computer hardware, screen projection, stage lights, power tools, camping gear, event kitchen/caterer machinery, etc. Match the equipment category logically to their described event!).
Ensure all equipment details match their experience level (${level}), event setting (${location}), expected capacity (${people} people), and rental duration/days (${duration}).

Always adhere to the user's budget ceiling or scale budget amounts logically in their chosen currency: ${currency}.
If budget is ${budget}, tailor the Basic Package to fit well within or strictly at this budget. Scale the Recommended package appropriately around or moderately above the budget (adding optimal value), and provide a Premium Package that represents the absolute best-in-class tier.

Always recommend:
1. Package Name
2. Essential items with quantities, estimated individual/package costs, and reasons.
3. Estimated split budget breakdown between Equipment, Accessories, and Miscellaneous in the correct currency.
4. Specific critical backup equipment options for safety (crucial for live/important events).
5. Exact structural risks if they choose to omit specific critical equipment.
6. Highlight upsell opportunities to improve outcome and customer safety.
7. Direct comparison matrix (table data) between Basic, Recommended, and Premium.`;

    const userPrompt = `Customer Request Details:
- Use Case / Event: ${usecase}
- Crowd Size / Attendees: ${people}
- Budget Constraints: ${budget} [Currency: ${currency}]
- Rental Duration: ${duration}
- Location preference: ${location}
- User experience level: ${level}
- Extra Special Requirements: ${requirements || "None specified"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            basicPackage: {
              type: Type.OBJECT,
              properties: {
                packageName: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      cost: { type: Type.NUMBER, description: "Estimated package cost contribution" },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "quantity", "cost", "reason"]
                  }
                },
                optionalAddOns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "cost", "reason"]
                  }
                },
                budgetSplit: {
                  type: Type.OBJECT,
                  properties: {
                    equipment: { type: Type.NUMBER, description: "Cost estimate" },
                    accessories: { type: Type.NUMBER, description: "Cost estimate" },
                    miscellaneous: { type: Type.NUMBER, description: "Cost estimate" }
                  },
                  required: ["equipment", "accessories", "miscellaneous"]
                },
                benefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                finalRecommendation: { type: Type.STRING }
              },
              required: ["packageName", "items", "budgetSplit", "benefits", "finalRecommendation"]
            },
            recommendedPackage: {
              type: Type.OBJECT,
              properties: {
                packageName: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "quantity", "cost", "reason"]
                  }
                },
                optionalAddOns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "cost", "reason"]
                  }
                },
                budgetSplit: {
                  type: Type.OBJECT,
                  properties: {
                    equipment: { type: Type.NUMBER },
                    accessories: { type: Type.NUMBER },
                    miscellaneous: { type: Type.NUMBER }
                  },
                  required: ["equipment", "accessories", "miscellaneous"]
                },
                benefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                finalRecommendation: { type: Type.STRING }
              },
              required: ["packageName", "items", "budgetSplit", "benefits", "finalRecommendation"]
            },
            premiumPackage: {
              type: Type.OBJECT,
              properties: {
                packageName: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "quantity", "cost", "reason"]
                  }
                },
                optionalAddOns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    },
                    required: ["name", "cost", "reason"]
                  }
                },
                budgetSplit: {
                  type: Type.OBJECT,
                  properties: {
                    equipment: { type: Type.NUMBER },
                    accessories: { type: Type.NUMBER },
                    miscellaneous: { type: Type.NUMBER }
                  },
                  required: ["equipment", "accessories", "miscellaneous"]
                },
                benefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                finalRecommendation: { type: Type.STRING }
              },
              required: ["packageName", "items", "budgetSplit", "benefits", "finalRecommendation"]
            },
            backupEquipment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["name", "reason"]
              }
            },
            risksIfOmitted: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipment: { type: Type.STRING },
                  risk: { type: Type.STRING }
                },
                required: ["equipment", "risk"]
              }
            },
            upsellOpportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  idea: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["idea", "description"]
              }
            },
            comparisonTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  basic: { type: Type.STRING },
                  recommended: { type: Type.STRING },
                  premium: { type: Type.STRING }
                },
                required: ["feature", "basic", "recommended", "premium"]
              }
            }
          },
          required: [
            "basicPackage",
            "recommendedPackage",
            "premiumPackage",
            "backupEquipment",
            "risksIfOmitted",
            "upsellOpportunities",
            "comparisonTable"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini.");
    }
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Router Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while compiling rental packages."
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  // Port MUST be 3000 as per environment guidelines
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to start server:", err);
});
