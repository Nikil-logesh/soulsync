'use client';

import { useState, useEffect } from 'react';

export type Mood = {
  mood: string;
  label: string;
  emoji: string;
  timestamp: string;
};

export function useMoodContext() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);

  // Load mood from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMood = localStorage.getItem('userCurrentMood');
      if (savedMood) {
        try {
          const parsedMood = JSON.parse(savedMood);
          setCurrentMood(parsedMood);
        } catch (error) {
          console.error('Error parsing saved mood:', error);
        }
      }
    }
  }, []);

  // Function to save mood
  const saveMood = (mood: Mood) => {
    setCurrentMood(mood);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCurrentMood', JSON.stringify(mood));
    }
  };

  // Function to get mood context for AI
  const getMoodContext = () => {
    if (!currentMood) return '';
    
    const timeAgo = getTimeAgo(new Date(currentMood.timestamp));
    return `The user is currently feeling ${currentMood.label} ${currentMood.emoji} (selected ${timeAgo} ago). Please take this emotional state into consideration when providing responses and be empathetic to their current mood.`;
  };

  // Function to clear mood
  const clearMood = () => {
    setCurrentMood(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userCurrentMood');
    }
  };

  return {
    currentMood,
    saveMood,
    clearMood,
    getMoodContext
  };
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
}