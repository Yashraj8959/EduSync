"use server";

import { PrismaClient } from "@/lib/generated/prisma/index.js";
const db = new PrismaClient();
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateRoadmap(data) {
  console.log("Generate Roadmap hit");

  const { userId } = await auth();
  console.log("User ID:", userId);
  console.log("Data received:", data);

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate a detailed learning roadmap for "${data.topic}".
    Strict JSON output only. No markdown, no text, no explanation.
    Format:
    [
      {
        "name": "Step 1 Title",
        "description": "2-3 sentences description.",
        "resources": [
          "Official Documentation URL",
          "Popular Blog URL",
          "YouTube Video/Channel URL"
        ]
      },
      {
        "name": "Step 2 Title",
        "description": "2-3 sentences description.",
        "resources": [
          "Link 1",
          "Link 2",
          "Link 3"
        ]
      }
    ]
    Minimum 20-30 steps. Beginner friendly. Logical sequence.In name write step no is mandatory
  `;

  try {
    const result = await model.generateContent(prompt);

    if (!result.response) {
      console.error("❌ No response from Gemini.");
      throw new Error("No response from model");
    }

    let rawContent = result.response.text().trim();
    console.log("Raw model response:", rawContent);

    // CLEANING
    rawContent = rawContent
      .replace(/^```json/, '') // remove starting ```json
      .replace(/^```/, '')     // remove starting ```
      .replace(/```$/, '')     // remove ending ```
      .trim();

    console.log("Cleaned model response:", rawContent);

    if (!rawContent) {
      console.error("❌ Empty response after cleaning.");
      throw new Error("Empty cleaned response");
    }

    // SAFE PARSING
    let parsedRoadmap;
    try {
      parsedRoadmap = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      throw new Error("Failed to parse roadmap JSON");
    }

    console.log("✅ Parsed Roadmap:", parsedRoadmap);

    // FINAL STRUCTURE
    return parsedRoadmap.map((step, index) => ({
      name: step.name || `Step ${index + 1}`,
      description: step.description || "No description provided",
      resources: Array.isArray(step.resources) ? step.resources : [],
    }));

  } catch (error) {
    console.error("❌ Error generating roadmap:", error.message);
    throw new Error("Failed to generate roadmap. Please try again later.");
  }
}
