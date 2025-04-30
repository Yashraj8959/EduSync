// components/ui/loading-edusync-lottie.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const LoadingEduSyncLottie = ({
  // animationPath = "/animations/edusync-loader.json", // Default path in /public
  animationData = null, // Option to pass data directly
  message = "Syncing your learning experience...",
  loop = true,
  play = true,
  width = '160px', // Default size
  height = '160px', // Default size
}) => {
  const [loadedAnimationData, setLoadedAnimationData] = useState(animationData);

  
  // Don't render until the animation JSON is loaded
  if (!loadedAnimationData) {
      // You could return a simpler fallback loader here if fetching takes time
      // e.g., return <div className="fixed inset-0 bg-background z-50"></div>;
      return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm text-foreground" // Themed overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Lottie Player */}
      
      <DotLottieReact
      src="https://lottie.host/5aacb17a-74dd-4df9-a6ea-5e64e763d6ad/55CruKmi0A.lottie"
      loop
      autoplay
    />

      {/* Loading Message */}
      {message && ( // Only show message if provided
        <p className="text-base font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </motion.div>
  );
};

export default LoadingEduSyncLottie;