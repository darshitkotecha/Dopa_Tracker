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

  // AI Habit Tips Endpoint using Gemini
  app.get("/api/habit-tips", async (req, res) => {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Give me 1 quick, motivating cricket-themed habit building tip. Stay under 20 words. Focus on consistency or 'staying at the crease'.",
      });
      
      const text = response.text;
      
      res.json({ tip: text.trim() });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.json({ tip: "Consistency is like staying at the crease; keep playing to score big!" });
    }
  });

  // Redemption Endpoint
  app.post("/api/redeem", async (req, res) => {
    const { email, rewardName, pointsSpent, couponCode } = req.body;
    
    // In a real app, you'd use a mail service like SendGrid or Resend.
    // Here we log the "real" action to simulate the integration.
    console.log(`[Habit Quest] Sending redemption email to ${email}`);
    console.log(`[Habit Quest] Reward: ${rewardName}, Points: ${pointsSpent}, Code: ${couponCode}`);

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
    console.log(`Habit Quest Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
