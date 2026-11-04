'use client'
import { useState, useEffect } from 'react';

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
    }, 300);

    return () => clearInterval(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="relative w-64 h-64 mb-8">
        {/* Animated logo/camera icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white border-opacity-30 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 backdrop-blur-sm animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
        Lenscrafter Hub
      </h1>
      <p className="text-white text-opacity-80 mb-6 animate-fade-in">
        Crafting your visual experience...
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-white text-sm">{progress}%</span>

      {/* Animated dots */}
      <div className="flex space-x-1 mt-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-white rounded-full opacity-70"
            style={{
              animation: `bounce 1.4s infinite ${i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}