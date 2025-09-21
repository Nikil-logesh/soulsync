"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useLocation } from "../../hooks/useLocation";
import VoiceInput from "../../components/VoiceInput";

export default function PromptPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [popup, setPopup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messageIdRef = useRef(0);
  
  const { location, detectLocation } = useLocation();

  const handleVoiceTranscript = async (transcript: string) => {
    // Add user message to chat
    const userMessage = {
      id: `user-${++messageIdRef.current}`,
      type: 'user' as const,
      content: transcript,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    setError("");
    setPopup(null);

    try {
      const guestMode = !session?.user;
      const requestBody: any = { 
        userPrompt: transcript,
        guestMode: guestMode
      };
      
      // Include location data if available for cultural responses
      if (location) {
        requestBody.userLocation = {
          country: location.country,
          state: location.state,
          city: location.city
        };
      }

      // Include previous conversation context for personalized responses
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      if (recentMessages.length > 0) {
        requestBody.conversationHistory = recentMessages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        }));
      }

      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.action === "popup") {
          setPopup(data);
        } else {
          // Add AI response to chat
          const aiMessage = {
            id: `ai-${++messageIdRef.current}`,
            type: 'ai' as const,
            content: data.reply,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8"
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-blue-600 mb-4"
        >
          Hi Buddy...Share what's in your mind
        </motion.h2>
        
        {/* Location Context Indicator */}
        {location ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center"
          >
            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-blue-700">
              🌍 Providing culturally aware support for {location.city}, {location.state}, {location.country}
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 flex items-center"
          >
            <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-orange-700 mr-3">
              Enable location for culturally-aware responses
            </span>
            <button
              onClick={detectLocation}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
            >
              📍 Get Location
            </button>
          </motion.div>
        )}
        
        {/* Chat Area with Simple Smiley */}
        <div className="flex items-start gap-6 w-full max-w-4xl">
          {/* Left Simple Smiley Mascot */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block flex-shrink-0"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative"
            >
              {/* Large Smiley Face */}
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full relative shadow-lg border-4 border-yellow-300">
                {/* Eyes */}
                <div className="absolute top-6 left-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                <div className="absolute top-6 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                {/* Smile */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-4 border-4 border-gray-800 border-t-transparent rounded-b-full"></div>
              </div>
              {/* Speech bubble from mascot - repositioned to avoid overlap */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-32 -top-2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 text-sm text-gray-700 whitespace-nowrap"
              >
                I'm here to help! 😊
                <div className="absolute left-0 top-6 w-0 h-0 border-r-8 border-t-4 border-b-4 border-transparent border-r-white -translate-x-2"></div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Voice Input Component */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-2xl mx-auto relative"
          >
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              placeholder="Share what's in your mind... You can type or speak in your preferred language"
              disabled={loading}
            />
          </motion.div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-600 font-medium"
          >
            {error}
          </motion.div>
        )}        {/* Show popup for CRISIS/SEVERE */}
        {popup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-8 w-full max-w-xl text-left rounded-xl p-6 shadow-2xl
              ${popup.severity === "CRISIS" ? "bg-red-100 border border-red-300" : "bg-yellow-100 border border-yellow-300"}
            `}
          >
            <h3 className={`text-lg font-semibold mb-2
              ${popup.severity === "CRISIS" ? "text-red-600" : "text-yellow-700"}
            `}>
              {popup.severity === "CRISIS" ? "🚨 Immediate Help Needed" : "⚠️ Heavy Feelings Detected"}
            </h3>
            <p className="text-gray-700 whitespace-pre-line mb-4">{popup.message}</p>
            
            {/* Crisis Resources with better formatting */}
            {popup.resources && popup.resources.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 border-b pb-1">
                  📞 Emergency Helplines
                </h4>
                {popup.resources.map((r: any, index: number) => (
                  <div
                    key={r.url || index}
                    className="bg-white rounded-lg p-3 border border-gray-300 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{r.name}</h5>
                        {r.phone && (
                          <div className="flex items-center mt-1">
                            <span className="text-lg mr-2">📞</span>
                            <a 
                              href={`tel:${r.phone}`}
                              className="text-blue-600 font-mono font-semibold hover:text-blue-800"
                            >
                              {r.phone}
                            </a>
                          </div>
                        )}
                        {r.location && (
                          <div className="flex items-center mt-1">
                            <span className="text-sm mr-2">📍</span>
                            <span className="text-sm text-gray-600">{r.location}</span>
                          </div>
                        )}
                      </div>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-3xl space-y-4"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-4 shadow-md ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white ml-8' 
                    : 'bg-white border border-gray-200 text-gray-800 mr-8'
                }`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mr-2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">SoulSync</span>
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="whitespace-pre-line leading-relaxed" 
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        wordSpacing: '0.1em'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n\n/g, '<br><br>')
                          .replace(/^\d+\.\s/gm, '<div style="margin: 8px 0;"><strong>$&</strong>')
                          .replace(/^[•·]\s/gm, '<div style="margin: 4px 0; padding-left: 12px;">$&')
                          .replace(/🌟|💭|🆘|📞|📍|☕|🎵|🏛️|🌸|🎨/g, '<span style="font-size: 16px;">$&</span>')
                      }}
                    />
                  </div>
                  
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator when loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-md mr-8">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">SoulSync</span>
                  </div>
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
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
