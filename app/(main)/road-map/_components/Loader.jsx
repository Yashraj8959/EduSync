"use client";

import { motion } from "framer-motion";

export function Loader() {
  const circleCommonClasses = "h-5 w-5 bg-indigo-500 rounded-full";

  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-4">
      <p className="text-lg text-gray-400">Generating roadmap, please wait...</p>
      <div className="flex space-x-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={circleCommonClasses}
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
