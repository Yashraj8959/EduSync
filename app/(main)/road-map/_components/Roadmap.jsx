"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"; // Importing react-icons

const RoadmapComponent = ({ roadmapData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  useEffect(() => {
    // No need to calculate lines anymore
  }, [expandedIndex, roadmapData]);

  if (!roadmapData || roadmapData.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No roadmap data available.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="roadmap-container"
      className="relative w-full min-h-screen py-20 overflow-hidden"
    >
      {/* SVG for the vertical line */}
      <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none sm:block hidden">
        {/* Circle at the top of the vertical line */}
        <circle cx="50%" cy="10" r="10" fill="#6366f1" />
        {/* Main vertical line */}
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#6366f1"
          strokeWidth="2"
          className="animate-pulse neon-effect"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-16">
        {roadmapData.map((step, index) => {
          const isLeft = index % 2 === 0;
          const isExpanded = expandedIndex === index;
          const cardAlignmentClass = isLeft
            ? "sm:mr-auto sm:ml-[calc(50% - 1px)]"
            : "sm:ml-auto sm:mr-[calc(50% - 1px)]";

          return (
            <motion.div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`w-full flex justify-center relative ${cardAlignmentClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                onClick={() => toggleExpand(index)}
                className="sm:w-96 p-6 bg-accent rounded-2xl border hover:shadow-lg hover:shadow-indigo-800 border-indigo-500 text-white cursor-pointer transition-all"
                style={{ maxWidth: '400px' }}
                whileTap={{ scale: 0.95 }}
              >
                <h2 className="text-xl font-bold mb-2 text-center">
                  {step.name}
                </h2>
                {!isExpanded ? (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 border border-indigo-500 px-4 py-1 rounded-md text-indigo-400 hover:bg-indigo-800 hover:text-white transition"
                    >
                      Expand
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-2 mt-3 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-zinc-300">{step.description}</p>
                    <p className="font-semibold">Useful Links:</p>
                    <ul className="list-decimal list-inside text-blue-400">
                      {step.resources.map((link, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {link.length > 40 ? link.slice(0, 35) + "..." : link}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapComponent;