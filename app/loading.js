"use client";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="text-center text-gray-500 align-middle min-h-screen flex flex-col justify-center items-center">
                    <p className="text-lg">Loading...</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mx-auto mt-4"></div> {/* Simple spinner */}
                  </div>
  );
}
