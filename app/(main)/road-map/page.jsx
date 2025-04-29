"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRoadmap } from "@/actions/Road-Map";
import RoadmapComponent from "./_components/Roadmap";

export default function CoverLetterPage() {
  const [topic, setTopic] = useState("");
  const [roadmapData, setRoadmapData] = useState([]); // 🛑 roadmap data store
  const [loading, setLoading] = useState(false); // 🛑 loading state

  async function handleGenerate() {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true); // 🛑 start loading

    try {
      const generatedData = await generateRoadmap({ topic });
      setRoadmapData(generatedData); // 🛑 Update roadmapData state
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
    } finally {
      setLoading(false); // 🛑 stop loading
    }
  }

  return (
    <div className="min-h-screen py-10 px-5 sm:px-10 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text">
            RoadMap Generator
          </h1>

          <div className="flex gap-4 items-center">
            {/* Input with Dark Theme */}
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter Topic (e.g., HTML, Python)"
              className="input input-bordered input-primary w-full sm:w-64 px-4 py-2 rounded-lg shadow-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Dark-themed Button */}
            <Button
              onClick={handleGenerate}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {/* Conditional rendering for roadmap data */}
        {loading ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">Loading...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mx-auto mt-4"></div> {/* Simple spinner */}
          </div>
        ) : roadmapData.length > 0 ? (
          <RoadmapComponent roadmapData={roadmapData} />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">No roadmap data available. Enter a topic to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}