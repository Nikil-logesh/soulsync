"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import VoiceInput from "../../components/VoiceInput";

export default function GuestChatPage() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const MAX_MESSAGES = 3;

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
      const requestBody: any = { userPrompt: transcript, guestMode: true };
      
      // No location data for guest users - only for authenticated users

      // Call the actual AI API for guest mode with real responses
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        let aiResponse = "";
        
        if (data.action === "popup") {
          // Handle crisis/severe cases in guest mode
          aiResponse = `🚨 ${data.message}\n\n`;
          if (data.resources && data.resources.length > 0) {
            aiResponse += "Resources:\n";
            data.resources.forEach((resource: any) => {
              aiResponse += `• ${resource.name}: ${resource.url}\n`;
            });
          }
          aiResponse += "\n💡 Sign in to SoulSync for personalized crisis support and more comprehensive assistance.";
        } else {
          // Normal chat response with guest mode note
          aiResponse = data.reply + "\n\n💡 This is guest mode with limited responses. Sign in for unlimited access to SoulSync's full AI capabilities!";
        }
        
        setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
      } else {
        // Fallback for API errors
        const fallbackResponse = `I understand you're looking for support. While I'm experiencing some technical difficulties, here are some immediate techniques:

🌟 **Breathing**: Try the 4-7-8 technique (inhale 4, hold 7, exhale 8)
🧠 **Grounding**: Name 5 things you can see, 4 you can hear, 3 you can touch
💙 **Remember**: You're not alone, and reaching out shows strength

💡 Sign in to SoulSync for full AI-powered support and unlimited conversations!`;
        
        setMessages([...newMessages, { type: 'ai', content: fallbackResponse }]);
      }
      
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

        {/* Voice Input Component */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl relative"
        >
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            placeholder={messageCount >= MAX_MESSAGES ? "Guest limit reached - Sign in for more!" : "Share your thoughts... You can type or speak in any language"}
            disabled={messageCount >= MAX_MESSAGES || loading}
          />
          
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