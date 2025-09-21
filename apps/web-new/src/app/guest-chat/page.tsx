"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { aiService } from "../../lib/aiService";
import Link from "next/link";
// import VoiceInput from "../../components/VoiceInput"; // Temporarily disabled

export default function GuestChatPage() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [inputText, setInputText] = useState(""); // Added for text input
  const MAX_MESSAGES = 3;

  // Handle text input submission
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    await handleVoiceTranscript(inputText);
    setInputText("");
  };

  const handleVoiceTranscript = async (transcript: string) => {
    if (messageCount >= MAX_MESSAGES) {
      setError("Guest limit reached! Sign in for unlimited messages.");
      return;
    }

    if (!transcript.trim()) return;

    setLoading(true);
    setError("");
    
    // Add user message
    const newMessages = [...messages, { type: 'user' as const, content: transcript }];
    setMessages(newMessages);
    setMessageCount(prev => prev + 1);

    try {
      // Use AI service for intelligent responses in guest mode
      const context = {
        guestMode: true
      };
      const data = await aiService.generateResponse(transcript, context);

      let aiResponse = "";
      
      if (data.action === "popup") {
        // Handle crisis/severe cases in guest mode
        aiResponse = `🚨 ${data.message}\n\n`;
        if (data.resources && data.resources.length > 0) {
          aiResponse += "Resources:\n";
          data.resources.forEach((resource: string) => {
            aiResponse += `• ${resource}\n`;
          });
        }
        aiResponse += "\n💡 Sign in to SoulSync for personalized crisis support and more comprehensive assistance.";
      } else {
        // Normal chat response with guest mode note
        aiResponse = data.message + "\n\n💡 This is guest mode with limited responses. Sign in for unlimited access to SoulSync's full AI capabilities!";
      }
        
      setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
      
    } catch (err) {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const remainingMessages = MAX_MESSAGES - messageCount;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8"
      >
        {/* Guest Chat Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-4">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              👋 Guest Chat Mode
            </h2>
            <p className="text-yellow-700">
              You have <span className="font-bold">{remainingMessages}</span> messages remaining.
              <Link href="/signin" className="text-blue-600 hover:text-blue-800 underline ml-1">
                Sign in for unlimited access!
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-blue-600 mb-8"
        >
          Try SoulSync Chat (Limited)
        </motion.h2>

        {/* No location detection for guest users */}

        {/* Chat Messages */}
        <div className="w-full max-w-2xl mb-6 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-4 rounded-xl ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white ml-12 text-right' 
                  : 'bg-white/80 backdrop-blur-sm border border-gray-200 mr-12 text-left'
              }`}
            >
              <div className={`font-medium mb-1 ${message.type === 'user' ? 'text-blue-100' : 'text-blue-600'}`}>
                {message.type === 'user' ? 'You' : 'SoulSync AI (Guest Mode)'}
              </div>
              <p>{message.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Text Input Component (Voice temporarily disabled) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl relative"
        >
          <form onSubmit={handleTextSubmit} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={messageCount >= MAX_MESSAGES ? "Guest limit reached - Sign in for more!" : "Share your thoughts... Type your message here"}
              disabled={messageCount >= MAX_MESSAGES || loading}
              className="w-full p-4 pr-12 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-colors bg-white/90 backdrop-blur-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={messageCount >= MAX_MESSAGES || loading || !inputText.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
          
          {/* Note about voice input being disabled */}
          <div className="mt-1 text-center">
            <span className="text-xs text-gray-500">
              Voice input temporarily disabled - Text input only
            </span>
          </div>
          
          {/* Guest Usage Counter */}
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              {loading ? "AI is thinking..." : messageCount >= MAX_MESSAGES ? "Limit Reached" : `Messages remaining: ${remainingMessages}`}
            </span>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-600 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Call to Action */}
        {messageCount >= MAX_MESSAGES && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 max-w-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🚀 Ready for More?
            </h3>
            <p className="text-gray-600 mb-6">
              You've used all your guest messages! Sign in to unlock:
            </p>
            <ul className="text-left mb-6 space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited AI chat sessions
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                Personalized responses and insights
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                Mental health screening tools
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                Progress tracking and analytics
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signin"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Sign In Now
              </Link>
              <Link 
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </motion.section>

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