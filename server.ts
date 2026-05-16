import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple in-memory cache
  const insightCache = new Map<string, { data: any, timestamp: number }>();
  const CACHE_TTL = 1000 * 60 * 60; // 1 hour

  // AI Habit Tips Endpoint using Gemini
  app.get("/api/habit-tips", async (req, res) => {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: "Give me 1 quick, motivating cricket-themed habit building tip. Stay under 20 words. Focus on consistency or 'staying at the crease'.",
      });
      
      const text = response.text || "Keep your eyes on the ball and stay consistent!";
      res.json({ tip: text.trim() });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      if (error.message?.includes("429") || error.status === 429) {
        console.warn("Quota exceeded for habit-tips. Check Settings > Secrets to select a billing-enabled key.");
      }
      res.json({ tip: "Consistency is like staying at the crease; keep playing to score big!" });
    }
  });

  // Insights and Suggestions Endpoint
  app.post("/api/habit-insights", async (req, res) => {
    try {
      const { habits } = req.body;
      const cacheKey = JSON.stringify(habits || []);
      
      const cached = insightCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const habitsStr = (habits || []).map((h: any) => `${h.name} (Streak: ${h.streak} days)`).join(", ");
      
      const prompt = `Based on these habits and their current streaks: ${habitsStr || "no habits yet"}. 
      Provide a JSON object with:
      1. "suggestions": array of {habit: string, advice: string} for what to improve.
      2. "benefits": array of {habit: string, benefit: string} for why these habits are good.
      3. "risks": array of {habit: string, risk: string} for what happens if they are missed.
      Ensure the advice is cricket-themed.`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      insightCache.set(cacheKey, { data, timestamp: Date.now() });
      res.json(data);
    } catch (error: any) {
      console.error("Insights Error:", error);
      if (error.message?.includes("429") || error.status === 429) {
        console.warn("Quota exceeded for habit-insights. Check Settings > Secrets to select a billing-enabled key.");
      }
      res.json({
        suggestions: [{ habit: "General", advice: "Maintain your stance and keep your eyes on the daily goals." }],
        benefits: [{ habit: "Routine", benefit: "Building a solid foundation for peak performance." }],
        risks: [{ habit: "Inconsistency", risk: "Losing focus can lead to an early exit from your streak." }]
      });
    }
  });

  // Daily Quote Image Endpoint
  app.get("/api/daily-quote", async (req, res) => {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // 1. Generate Quote Text
      const quoteResponse = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: "Provide a 10-word motivational cricket quote. Give a JSON with 'quote' and 'author'.",
        config: { responseMimeType: "application/json" }
      });
      const quoteData = JSON.parse(quoteResponse.text || '{"quote": "Stay at the crease.", "author": "Anonymous"}');

      // 2. Generate Image using Gemini (Try-catch for image gen as it is more likely to hit quota)
      let base64Image = "";
      try {
        const imageResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: `A motivational cinematic background for a cricket quote. A lonely cricket pitch at dusk. Silhouettes of players. No text.`,
        });

        if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              break;
            }
          }
        }
      } catch (e: any) {
        console.warn("Gemini Image Gen failed, using fallback URL.", e.message || e);
      }

      res.json({
        quote: quoteData.quote,
        author: quoteData.author,
        image: base64Image ? `data:image/png;base64,${base64Image}` : "https://images.unsplash.com/photo-1540747913346-19e3ad6436b9?w=1200&h=675&fit=crop"
      });
    } catch (error: any) {
      console.error("Quote Error:", error);
      if (error.message?.includes("429") || error.status === 429) {
        console.warn("Quota exceeded for daily-quote. Check Settings > Secrets to select a billing-enabled key.");
      }
      res.json({
        quote: "Don't let them bowling you out before you play your best innings.",
        author: "Coach G",
        image: "https://images.unsplash.com/photo-1540747913346-19e3ad6436b9?w=1200&h=675&fit=crop"
      });
    }
  });

  // Redemption Endpoint
  app.post("/api/redeem", async (req, res) => {
    const { email, rewardName, pointsSpent, couponCode } = req.body;
    
    // In a real app, you'd use a mail service like SendGrid or Resend.
    // Here we log the "real" action to simulate the integration.
    console.log(`[EpicDaily] Sending redemption email to ${email}`);
    console.log(`[EpicDaily] Reward: ${rewardName}, Points: ${pointsSpent}, Code: ${couponCode}`);

    // Simulate success
    res.json({ 
      success: true, 
      message: `Redemption successful! Confirmation sent to ${email}.`,
      couponCode: couponCode
    });
  });

  // Static Assets / Vite Middleware
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EpicDaily Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
