"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();
  
  const isGuest = status === 'unauthenticated';
  const isAuthenticated = status === 'authenticated';

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-blue-600">SoulSync</h2>
          <p className="text-gray-600">Loading your wellness companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 px-4 pb-8">
      
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center max-w-4xl mt-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-blue-600">SoulSync</span>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl px-4 mb-4">
          <span className="text-blue-600">SoulSync</span> is your personalized digital mental wellbeing platform. Explore tools to manage stress, access mental health screenings, and get professional support in a calm and private environment.
        </p>
        {isGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 text-yellow-800 font-medium"
          >
            👋 Welcome Guest! Limited features available - Sign in for full access
          </motion.div>
        )}
      </motion.header>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-col md:flex-row gap-8 mt-12 w-full max-w-5xl"
      >
        {/* Get Started Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 p-8 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 rounded-3xl shadow-2xl cursor-pointer relative overflow-hidden"
          onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
        >
          {/* Limited access badge for guests */}
          {isGuest && (
            <div className="absolute top-4 right-4 bg-red-400 text-red-900 text-xs px-2 py-1 rounded-full font-medium">
              Login Required
            </div>
          )}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl"
          />
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            {isAuthenticated ? "Personal Dashboard" : "Get Started"}
          </h2>
          <p className="text-gray-700">
            {isAuthenticated 
              ? "Access your personal dashboard with insights, resources, and guidance tailored to you."
              : "Sign in to unlock your personal dashboard with insights, wellness screenings, and personalized guidance."
            }
          </p>
        </motion.div>

        {/* Chatbot Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-2xl cursor-pointer relative overflow-hidden"
          onClick={() => router.push(isAuthenticated ? "/prompt" : "/guest-chat")}
        >
          {/* Limited access badge for guests */}
          {isGuest && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
              Limited (3 msgs)
            </div>
          )}
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-200 rounded-full opacity-30 blur-3xl"
          />
          <h2 className="text-2xl font-bold text-purple-700 mb-4">AI-guided Chatbot</h2>
          <p className="text-gray-700">
            {isAuthenticated 
              ? "Talk to our interactive chatbot for unlimited coping strategies, mindfulness exercises, and professional referrals."
              : "Try our AI chatbot with 3 free messages. Get coping strategies and mindfulness tips."
            }
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Background Blobs */}
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-purple-200 opacity-20 rounded-full top-20 left-10 blur-3xl -z-10"
      />
      <motion.div
        animate={{ x: [0, -20, 20, 0], y: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-96 h-96 bg-green-200 opacity-20 rounded-full bottom-10 right-10 blur-3xl -z-10"
      />
    </div>
  );
}


