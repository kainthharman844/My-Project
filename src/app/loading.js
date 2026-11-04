'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTag } from 'react-icons/fi'; // Changed from camera to a clothing tag/hanger concept

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowLoader(false), 500);
          return 100;
        }
        return prevProgress + Math.floor(Math.random() * 10) + 1;
      });
    }, 200); // Sped up slightly for better UX

    return () => clearInterval(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-white">
      
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        {/* Animated Rings */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-32 rounded-full border-2 border-amber-400/30"></div>
        </motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-48 h-48 rounded-full border border-amber-400/10 bg-amber-400/5 backdrop-blur-sm"></div>
        </motion.div>

        {/* Central Icon */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div className="w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] rotate-45">
            <FiTag className="w-10 h-10 text-neutral-950 -rotate-45" />
          </div>
        </motion.div>
      </div>

      {/* Brand Text */}
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-black tracking-tighter mb-2"
      >
        URBAN<span className="text-amber-400">.CLOTHES</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-neutral-400 text-sm mb-8 font-medium tracking-widest uppercase"
      >
        Loading Collection...
      </motion.p>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-4 border border-white/5">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Progress Glow */}
          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/50 to-transparent"></div>
        </div>
      </div>
      
      <motion.span 
        className="text-neutral-500 text-xs font-bold font-mono"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {progress}%
      </motion.span>

      {/* Animated Dots */}
      <div className="flex space-x-2 mt-12">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              backgroundColor: ["#404040", "#fbbf24", "#404040"] // neutral-700 to amber-400
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut" 
            }}
            className="w-2.5 h-2.5 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}