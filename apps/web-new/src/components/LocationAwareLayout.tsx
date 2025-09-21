// apps/web-new/src/components/LocationAwareLayout.tsx
"use client";

import { useSafeAuth } from "../contexts/useSafeAuth";
import { motion } from "framer-motion";
import SilentLocationDetector from "./SilentLocationDetector";
import { useLocation } from "../hooks/useLocation";

interface LocationAwareLayoutProps {
  children: React.ReactNode;
  showLocationPrompt?: boolean;
  skipForGuests?: boolean;
}

export default function LocationAwareLayout({ 
  children, 
  showLocationPrompt = false, // Default to false for silent operation
  skipForGuests = false 
}: LocationAwareLayoutProps) {
  const { user, loading } = useSafeAuth();
  const { location, clearLocation } = useLocation();

  const isAuthenticated = !!user;

  return (
    <div className="relative">
      {/* Silent Location Detection - Always active, no UI */}
      <SilentLocationDetector />

      {/* Optional Location Status Bar (subtle, only for authenticated users with location) */}
      {isAuthenticated && location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border-b border-blue-100 px-4 py-1"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center text-blue-600">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                📍 {location.city}, {location.state}
              </span>
            </div>
            <button
              onClick={clearLocation}
              className="text-blue-500 hover:text-blue-700 underline text-xs"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {children}
    </div>
  );
}