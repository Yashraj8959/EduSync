"use server";

import { PrismaClient } from "@/lib/generated/prisma/index.js";
const db = new PrismaClient();
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateQuiz(topic, numQuestions) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate ${numQuestions} multiple choice technical interview questions on the topic of ${topic} for a ${user.industry
    } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.

    Each question should be multiple choice with 4 options.

    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

You are tasked with analyzing the knowledge gaps based on the wrong answers.
Focus on constructive, deep, and specific improvement advice without directly mentioning the mistakes.

Your response must:

Identify knowledge gaps or topics to improve (inferred from the wrong answers).

Provide extensive learning advice, structured clearly into:

Areas needing focus

Practical exercises

High-quality learning resources

Long-term skill-building tips

Write in an encouraging, mentoring tone (uplifting, growth-focused).

Do not explicitly refer to the wrong answers or mistakes.

Make it highly actionable (the user should know exactly what to study or practice).

      Return the response in this JSON format only, no additional text:

      {
  "areasForImprovement": [
    {
      "concept": "Short Title of Concept",
      "details": "In-depth explanation of the concept and why it's important to master.",
      "topicsToStudy": [
        "Subtopic 1",
        "Subtopic 2",
        "Subtopic 3"
      ]
    },
    ...
  ],
  "resources": [
    {
      "title": "Resource Title",
      "description": "What this resource helps with",
      "link": "https://example.com"
    },
    ...
  ],
  "practiceExercises": [
    {
      "exercise": "Exercise title or description",
      "instructions": "Clear task/instruction for the user"
    },
    ...
  ],
  "roadmap": [
    {
      "week": 1,
      "focus": "Topics to study and practice",
      "tasks": [
        "Read [resource title]",
        "Complete [exercise name]",
        "Practice small projects or code snippets about [concept]"
      ]
    },
    {
      "week": 2,
      "focus": "Next layer of topics",
      "tasks": [
        ...
      ]
    }
    ...
  ],
  "finalAdvice": "Encouraging message focusing on continuous learning, resilience, and building deeper understanding.
      BrushUp and take your time to master these concepts and take test on x , y z topics to see your progress.
      Remember, mastery takes time and practice. Don't rush it!", and to keep x , y, z in mind.
      Keep practicing and learning, and you'll see improvement over time.
  "
}



    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);


      const response = tipResult.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      improvementTip = JSON.parse(cleanedText);


      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

// fetch the assessment information
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc", // assending order
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}