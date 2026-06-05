import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI interactions may fail.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Generate a personalized workout plan using Gemini
app.post("/api/generate-workout", async (req, res) => {
  try {
    const { goal, level, equipment, duration, target } = req.body;

    const ai = getGeminiClient();
    const systemPrompt = `You are WorkoutFlow AI, an elite personal trainer. 
Generate a detailed, highly effective, single-session workout plan based on the user's details. You must respond strictly in JSON matching the requested schema.
CRITICAL OPTIMIZATION: Keep the exercises extremely simple, classic, recognizable, and easy to understand (such as Push-Ups / Opdrukken, Squats / Kniebuigingen, Planken, Lunges / Uitvalsstappen, Bicep Curls, Jumping Jacks, Crunches, etc.). Do NOT use complex, obscure, or highly advanced exercise names or movements.
All exercise names, preparation details, instructions, and titles MUST be written in clean, understandable Dutch, or specify the clear Dutch equivalent in parentheses (e.g. "Push-Ups (Opdrukken)"). This is to make sure every beginner or casual athlete can immediately understand how to perform them!`;

    const userPrompt = `Genereer een eenvoudige, motiverende workout van ${duration} minuten gericht op "${target}". 
Mijn fitnessniveau is "${level}", mijn doel is "${goal}" en ik heb toegang tot "${equipment}".
Bied alleen simpele en herkenbare oefeningen aan met heldere Nederlandse instructies.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "targetFocus", "estimatedDuration", "estimatedCaloriesBurned", "exercises"],
          properties: {
            title: {
              type: Type.STRING,
              description: "Motivating, professional title of this workout session."
            },
            targetFocus: {
              type: Type.STRING,
              description: "The primary muscle groups targeted."
            },
            estimatedDuration: {
              type: Type.INTEGER,
              description: "Total duration in minutes (warm-up, exercises, and cool-down)."
            },
            estimatedCaloriesBurned: {
              type: Type.INTEGER,
              description: "Scientific estimate of total calories burned during this specific session."
            },
            exercises: {
              type: Type.ARRAY,
              description: "List of exercises in order. Include warm-up as the first exercise and cool-down as the last exercise.",
              items: {
                type: Type.OBJECT,
                required: ["name", "sets", "reps", "restSeconds", "instructions"],
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Name of the exercise (e.g., Dumbbell Goblet Squat)"
                  },
                  sets: {
                    type: Type.INTEGER,
                    description: "Number of sets (use 1 for warm-up/cool-down if appropriate)"
                  },
                  reps: {
                    type: Type.STRING,
                    description: "Reps description (e.g. '10-12 reps' or '30 seconds')"
                  },
                  restSeconds: {
                    type: Type.INTEGER,
                    description: "Seconds of recommended rest after each set of this exercise"
                  },
                  instructions: {
                    type: Type.STRING,
                    description: "Very clear, short teaching cue/tip on proper form."
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    const workoutPlan = JSON.parse(responseText.trim());
    res.json({ success: true, workoutPlan });
  } catch (error: any) {
    console.error("Error in /api/generate-workout:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate workout plan." });
  }
});

// Generate a personalized meal plan using Gemini
app.post("/api/generate-meals", async (req, res) => {
  try {
    const { goal, level, dietaryPreference, weightKg, heightCm, age } = req.body;

    const ai = getGeminiClient();
    const systemPrompt = `You are WorkoutFlow Nutritionist, a world-class elite sports dietician. Generate a perfect, scientifically calibrated single-day athletic meal plan based on the user's details. You must respond strictly in JSON matching the requested schema. Ensure the meal choices are incredibly appetizing, easy to prepare, and optimized for their profile: goal is "${goal}", level is "${level}", dietary preference is "${dietaryPreference}", weight is ${weightKg || 75}kg, height is ${heightCm || 180}cm, and age is ${age || 25}. Specify precise macronutrients (protein, carbs, fats) and calorie contents. All texts should be written in English so that you match the current UI completely, but with high motivation! Do not include markdown code block formatting in your response; output pure JSON text.`;

    const userPrompt = `Generate a single-day elite meal plan for a customized fitness routine. Goal: "${goal}". Dietary Style: "${dietaryPreference}". Target Athlete Weight: ${weightKg || 75}kg, Height: ${heightCm || 180}cm, Age: ${age || 25}. Ensure calorie and macro bounds are healthy and optimized.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["targetCalories", "proteinGrams", "carbsGrams", "fatsGrams", "meals", "coachNutritionTip"],
          properties: {
            targetCalories: {
              type: Type.INTEGER,
              description: "Total estimated daily caloric intake target."
            },
            proteinGrams: {
              type: Type.INTEGER,
              description: "Total daily target protein intake in grams."
            },
            carbsGrams: {
              type: Type.INTEGER,
              description: "Total daily target carbohydrate intake in grams."
            },
            fatsGrams: {
              type: Type.INTEGER,
              description: "Total daily target fat intake in grams."
            },
            meals: {
              type: Type.ARRAY,
              description: "List of recommended meals of the day (minimum 3, e.g. Breakfast, Lunch, Post-workout snack, Dinner).",
              items: {
                type: Type.OBJECT,
                required: ["type", "name", "calories", "protein", "carbs", "fats", "ingredients", "preparation"],
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Meal group, e.g. 'Breakfast', 'Lunch', 'Snack', 'Dinner'"
                  },
                  name: {
                    type: Type.STRING,
                    description: "Compelling name of the recommended meal course."
                  },
                  calories: {
                    type: Type.INTEGER,
                    description: "Est. calories in this serving."
                  },
                  protein: {
                    type: Type.INTEGER,
                    description: "Est. protein in grams."
                  },
                  carbs: {
                    type: Type.INTEGER,
                    description: "Est. carbs in grams."
                  },
                  fats: {
                    type: Type.INTEGER,
                    description: "Est. fats in grams."
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Grocery list/ingredients needed, with quantities (metric)."
                  },
                  preparation: {
                    type: Type.STRING,
                    description: "Quick 1-2 sentence preparation steps."
                  }
                }
              }
            },
            coachNutritionTip: {
              type: Type.STRING,
              description: "A professional, punchy athletic sports science nutritionist pro-tip tailored to their goals."
            }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    const mealPlan = JSON.parse(responseText.trim());
    res.json({ success: true, mealPlan });
  } catch (error: any) {
    console.error("Error in /api/generate-meals:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate personal meal plan." });
  }
});

// AI Fitness Coach chat connection
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    
    // Convert client-side message structure to correct chat history for Gemini
    // Map roles: 'user' -> 'user', 'ai' or 'model' -> 'model'
    const cleanContents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = 
      "You are 'WorkoutFlow Coach', a premium certified athletic trainer, kinesiologist, and sports nutritionist. " +
      "Provide highly encouraging, scientifically grounded fitness, biomechanics, and nutrition advice. " +
      "Keep your responses concise, highly motivating, structured with bullet points where useful, " +
      "and direct. Emphasize safe form, progressive overload, and consistent water intake. " +
      "Since you are integrated inside the WorkoutFlow smart tracker app, suggest they generate " +
      "a workout in the builder or log their exercises, and refer to their goals when applicable.";

    // Send chat message request
    const lastMsg = cleanContents[cleanContents.length - 1];
    const previousHistory = cleanContents.slice(0, cleanContents.length - 1);

    // Call API using chats history representation or directly passing content blocks to generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...previousHistory,
        lastMsg
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    const reply = response.text || "I am here to support you! Let's hit our goals together.";
    res.json({ success: true, text: reply });
  } catch (error: any) {
    console.error("Error in /api/coach-chat:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to run coach analysis." });
  }
});

// Health check and environment confirmation
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", keyStatus: !!process.env.GEMINI_API_KEY });
});

// -------------------------------------------------------------
// Vite Dev & Production Static Middleware
// -------------------------------------------------------------
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorkoutFlow backend running on http://localhost:${PORT}`);
  });
}

initServer();
