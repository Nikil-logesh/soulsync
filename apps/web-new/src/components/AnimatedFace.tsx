"use client";

import { useState, useEffect } from "react";

interface AnimatedFaceProps {
  expression: "neutral" | "happy" | "sad" | "surprised";
  talking?: boolean;
  thinking?: boolean;
}

export default function AnimatedFace({
  expression,
  talking = false,
  thinking = false,
}: AnimatedFaceProps) {
  const [blinkState, setBlinkState] = useState(false);
  
  // Automatic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 4000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Determine current animation state
  const getCurrentAnimation = () => {
    if (talking) return 'talking';
    if (thinking) return 'thinking';
    return expression;
  };

  const currentAnimation = getCurrentAnimation();

  return (
    <div className="w-32 h-32 flex items-center justify-center">
      <div className="relative">
        {/* Mickey's Ears */}
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-black rounded-full border-2 border-gray-800" />
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-black rounded-full border-2 border-gray-800" />
        
        {/* Mickey's Head */}
        <div 
          className={`relative w-28 h-28 bg-gray-100 rounded-full border-4 border-black transition-all duration-300 ${
            currentAnimation === 'thinking' ? 'transform rotate-2' :
            currentAnimation === 'happy' ? 'transform scale-105' :
            currentAnimation === 'surprised' ? 'transform scale-110' : ''
          }`}
        >
          {/* Eyes */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {/* Left Eye */}
            <div 
              className="w-5 h-5 bg-white rounded-full border-2 border-black flex items-center justify-center transition-all duration-150"
              style={{ height: blinkState ? '4px' : '20px' }}
            >
              {!blinkState && (
                <div 
                  className={`w-3 h-3 bg-black rounded-full transition-all duration-300 ${
                    currentAnimation === 'thinking' ? 'transform translate-x-1 -translate-y-0.5' : ''
                  }`}
                  style={{ 
                    width: currentAnimation === 'surprised' ? '14px' : '12px',
                    height: currentAnimation === 'surprised' ? '14px' : '12px'
                  }}
                />
              )}
            </div>
            
            {/* Right Eye */}
            <div 
              className="w-5 h-5 bg-white rounded-full border-2 border-black flex items-center justify-center transition-all duration-150"
              style={{ height: blinkState ? '4px' : '20px' }}
            >
              {!blinkState && (
                <div 
                  className={`w-3 h-3 bg-black rounded-full transition-all duration-300 ${
                    currentAnimation === 'thinking' ? 'transform translate-x-1 -translate-y-0.5' : ''
                  }`}
                  style={{ 
                    width: currentAnimation === 'surprised' ? '14px' : '12px',
                    height: currentAnimation === 'surprised' ? '14px' : '12px'
                  }}
                />
              )}
            </div>
          </div>

          {/* Mickey's Nose */}
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full" />

          {/* Mouth */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            {currentAnimation === 'happy' && (
              <div className="w-10 h-5 border-b-4 border-l-4 border-r-4 border-black rounded-b-full bg-red-300" />
            )}
            
            {currentAnimation === 'sad' && (
              <div className="w-8 h-4 border-t-4 border-l-4 border-r-4 border-black rounded-t-full transform rotate-180" />
            )}
            
            {currentAnimation === 'surprised' && (
              <div className="w-5 h-6 bg-black rounded-full border-2 border-gray-600" />
            )}
            
            {currentAnimation === 'talking' && (
              <div className="w-6 h-4 border-4 border-black rounded-full bg-red-200 animate-pulse" />
            )}
            
            {(['neutral'].includes(currentAnimation)) && (
              <div className="w-6 h-2 bg-black rounded-full" />
            )}

            {currentAnimation === 'thinking' && (
              <div className="w-3 h-3 bg-black rounded-full opacity-80" />
            )}
          </div>

          {/* Mickey's Cheeks */}
          {currentAnimation === 'happy' && (
            <>
              <div className="absolute top-12 left-3 w-4 h-4 bg-red-200 rounded-full opacity-60" />
              <div className="absolute top-12 right-3 w-4 h-4 bg-red-200 rounded-full opacity-60" />
            </>
          )}
        </div>

        {/* Mickey's Body/Shirt */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-red-600 rounded-t-full border-2 border-black">
          {/* Two yellow buttons */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full border border-black" />
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full border border-black" />
        </div>
      </div>
    </div>
  );
}