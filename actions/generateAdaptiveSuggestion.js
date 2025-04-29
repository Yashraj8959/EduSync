// lib/actions/generateAdaptiveSuggestion.js

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const MAX_ASSESSMENTS_TO_CONSIDER = 3;

export async function generateAdaptiveSuggestion() {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("User not authenticated.");
    }
  
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true, industry: true, skills: true },
    });
  
    if (!user) {
        // Consider returning null?
        console.error(`generateAdaptiveSuggestion: User record not found in DB for clerkUserId ${clerkUserId}.`);
        return null;
        // throw new Error("User not found in database.");
      }

  try {
    

    const recentAssessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: MAX_ASSESSMENTS_TO_CONSIDER,
      select: {
        quizScore: true,
        questions: true,
        createdAt: true,
      },
    });

    if (!recentAssessments || recentAssessments.length === 0) {
      console.log(`generateAdaptiveSuggestion: No recent assessments found for user ${user.id} (Clerk: ${clerkUserId}).`);
      return null;
    }

    let performanceSummary = `Recent Quiz Performance (${recentAssessments.length} quizzes):\n`;
    const allWrongAnswers = [];

    recentAssessments.forEach((assessment, index) => {
      const score = assessment.quizScore ?? 0;
      performanceSummary += `- Quiz ${index + 1} (${assessment.createdAt.toLocaleDateString()}): ${score.toFixed(1)}%\n`;
      const wrongAnswers = (assessment.questions || []).filter(q => !q.isCorrect);
      allWrongAnswers.push(...wrongAnswers.map(q => ({
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.answer,
        explanation: q.explanation,
      })));
    });

    if (allWrongAnswers.length === 0 && recentAssessments.every(a => (a.quizScore ?? 0) >= 95)) {
      console.log(`generateAdaptiveSuggestion: User ${userId} performing well, no specific weaknesses identified.`);
      return {
        areasForImprovement: [],
        resources: [],
        practiceExercises: [],
        roadmap: [],
        finalAdvice: "Excellent work! You're consistently performing well on recent quizzes. Keep exploring advanced topics in your field to continue growing.",
        analysisSummary: "Consistently high scores on recent quizzes indicate a strong grasp of the tested concepts."
      };
    }

    const recurringWrongConcepts = calculateRecurringConcepts(allWrongAnswers);

    const analysisInput = `
      User Profile Context:
      Industry: ${user?.industry || 'Not specified'}
      Skills: ${user?.skills?.join(', ') || 'Not specified'}

      ${performanceSummary}

      Recurring Weaknesses Identified (based on wrong answers across recent quizzes):
      ${recurringWrongConcepts.length > 0 ? recurringWrongConcepts.map(c => `- ${c.concept} (missed ${c.count} times)`).join('\n') : 'No specific recurring weaknesses identified, focus on general improvement or areas with lower scores.'}

      Examples of Recent Mistakes:
      ${allWrongAnswers.slice(0, 3).map(q => `- Q: "${q.question}" -> Your Answer: "${q.userAnswer}", Correct: "${q.correctAnswer}"`).join('\n')}
    `;

    const prompt = `
      You are an AI learning coach for an adaptive learning platform.
      Analyze the provided user context, recent quiz performance summary, identified recurring weaknesses, and mistake examples.

      Based *only* on this provided data, generate a concise, actionable, and personalized improvement plan focused on addressing the user's *recurring* knowledge gaps and performance trends.

      Context & Data:
      ${analysisInput}

      Instructions:
      1.  **Prioritize**: Focus recommendations on the recurring weaknesses or areas where performance is lowest.
      2.  **Synthesize**: Do not just repeat the input. Create a *new, cohesive* plan based on the overall picture.
      3.  **Actionable**: Provide specific, concrete steps (topics to study, exercises to practice, resources to use).
      4.  **Encouraging Tone**: Maintain a positive, growth-oriented tone.
      5.  **Roadmap**: Create a short-term (1-2 week) roadmap focusing on the highest priority areas.
      6.  **Brevity**: Keep descriptions clear and to the point.
      7.  **JSON Output**: Return *only* the following JSON structure, filling in the details based on your analysis. Do not include any other text, greetings, or explanations outside the JSON.

      JSON Format:
      {
        "areasForImprovement": [
          {
            "concept": "Key Concept 1 (Recurring Weakness)",
            "details": "Brief explanation of why mastering this concept is important based on performance.",
            "topicsToStudy": ["Specific Subtopic A", "Specific Subtopic B"]
          }
        ],
        "resources": [
          {
            "title": "Targeted Resource 1",
            "description": "How this resource addresses the identified weakness.",
            "link": "https://example.com/resource1"
          }
        ],
        "practiceExercises": [
          {
            "exercise": "Targeted Practice Exercise 1",
            "instructions": "Instructions focused on reinforcing the weak concept."
          }
        ],
        "roadmap": [
          {
            "week": 1,
            "focus": "Addressing [Highest Priority Weakness]",
            "tasks": ["Review [Resource Title]", "Complete [Exercise Name]", "Study [Specific Subtopic A]"]
          }
        ],
        "finalAdvice": "Encouraging summary acknowledging recent performance trend (e.g., 'You're making progress in X, focus now on Y...') and motivating continued practice.",
        "analysisSummary": "A brief (1-2 sentence) summary of the key findings from the performance data."
      }
    `;

    console.log("generateAdaptiveSuggestion: Sending prompt to AI...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?/g, "").trim();
    const adaptiveTip = JSON.parse(cleanedText);

    console.log("generateAdaptiveSuggestion: Successfully generated adaptive tip.");
    return adaptiveTip;

  } catch (error) {
    console.error("Error generating adaptive suggestion:", error);
    return null;
  }
}

function calculateRecurringConcepts(wrongAnswers) {
  const conceptCounts = {};

  wrongAnswers.forEach(q => {
    const concept = extractConceptFromQuestion(q.question);
    if (concept) {
      conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
    }
  });

  return Object.entries(conceptCounts)
    .map(([concept, count]) => ({ concept, count }))
    .filter(item => item.count > 1)
    .sort((a, b) => b.count - a.count);
}

function extractConceptFromQuestion(questionText) {
  questionText = questionText.toLowerCase();
  if (questionText.includes("react hook")) return "React Hooks";
  if (questionText.includes("virtual dom")) return "Virtual DOM";
  if (questionText.includes("state management")) return "State Management";
  if (questionText.includes("asynchronous javascript")) return "Async JS";
  return null;
}
