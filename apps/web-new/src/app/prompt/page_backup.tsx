"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "../../hooks/useLocation";
import { useAuth } from "../../contexts/AuthContext";
import { aiService } from "../../lib/aiService";
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from "@heroicons/react/24/outline";

export default function PromptPage() {
  const { user } =                 color: "white",
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                background: "transparent"
              }}
            />
            
            {/* Right-side buttons container */}();
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [popup, setPopup] = useState<{
    title: string;
    message: string;
    action?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hi-IN");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messageIdRef = useRef(0);
  const recognitionRef = useRef<any>(null);
  
  const supportedLanguages = [
    // Indian Languages
    { code: "hi-IN", name: "Hindi" },
    { code: "en-IN", name: "English (India)" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "mr-IN", name: "Marathi" },
    { code: "bn-IN", name: "Bengali" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "or-IN", name: "Odia" },
    { code: "as-IN", name: "Assamese" },
    // Common Foreign Languages
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ar-SA", name: "Arabic" }
  ];
  
  const { location, detectLocation } = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageDropdown) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLanguageDropdown]);

  // Add initial AI greeting
  useEffect(() => {
    const welcomeMessage = {
      id: "ai-welcome",
      type: "ai" as const,
      content: "Hi! I'm your SoulSync AI companion. I'm here to listen and support you 24/7. What's on your mind today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleTextSubmit = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${++messageIdRef.current}`,
      type: "user" as const,
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    setLoading(true);
    setError("");

    try {
      const guestMode = !user;
      const context = {
        location: location ? {
          country: location.country,
          state: location.state,
          city: location.city
        } : undefined,
        guestMode: guestMode
      };

      const data = await aiService.generateResponse(text, context);

      if (data.action === "popup") {
        setPopup({
          title: (data as any).title || "Alert",
          message: data.message,
          action: data.action
        });
      } else {
        const aiMessage = {
          id: `ai-${++messageIdRef.current}`,
          type: "ai" as const,
          content: data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setError("Failed to generate AI response.");
      const errorMessage = {
        id: `ai-error-${++messageIdRef.current}`,
        type: "ai" as const,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(inputText);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = selectedLanguage;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  return (
    <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white",
        position: "relative"
      }}>
      {/* Header */}
      <div style={{
        padding: "20px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "8px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px"
          }}>
            🤖
          </div>
          <div>
            <h1 style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent"
            }}>
              SoulSync AI Assistant
            </h1>
            <p style={{
              fontSize: "13px",
              margin: 0,
              color: "rgba(255,255,255,0.6)"
            }}>
              Online • Ready to help
            </p>
          </div>
        </div>
        
        {location && (
          <div style={{
            marginTop: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "20px",
            padding: "6px 16px",
            fontSize: "12px",
            color: "#10b981"
          }}>
            <div style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#10b981",
              borderRadius: "50%"
            }} />
            Providing support for {location.city}, {location.state}
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        height: "calc(100vh - 180px)",
        overflowY: "auto",
        padding: "20px"
      }}>
        {/* Welcome Section */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "60px 20px 40px"
            }}
          >
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "20px",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)"
            }}>
              💭
            </div>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 12px 0"
            }}>
              Start Your Conversation
            </h2>
            <p style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              lineHeight: "1.5"
            }}>
              Share what's on your mind. I'm here to listen and provide support.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: "flex",
                justifyContent: message.type === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px"
              }}
            >
              <div style={{
                maxWidth: "70%",
                padding: "14px 18px",
                borderRadius: "18px",
                background: message.type === "user" 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: message.type === "user" 
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "15px",
                lineHeight: "1.4",
                color: "white",
                boxShadow: message.type === "user" 
                  ? "0 4px 20px rgba(102, 126, 234, 0.4)"
                  : "0 4px 20px rgba(0, 0, 0, 0.3)",
                wordBreak: "break-word"
              }}>
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px"
            }}
          >
            <div style={{
              padding: "14px 18px",
              borderRadius: "18px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      borderRadius: "50%"
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                AI is thinking...
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(180deg, rgba(15, 52, 96, 0) 0%, rgba(15, 52, 96, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        padding: "20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          gap: "12px",
          alignItems: "flex-end"
        }}>
          <div style={{
            flex: 1,
            position: "relative"
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Send message..."
              style={{
                width: "100%",
                minHeight: "50px",
                maxHeight: "100px",
                padding: "14px 90px 14px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "25px",
                color: "white",
            }}
          >
            �🇳 {supportedLanguages.find(lang => lang.code === selectedLanguage)?.name || "Hindi"}
          </button>
          
          {showLanguageDropdown && (
            <div style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "12px",
              backgroundColor: "rgba(26, 26, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              padding: "8px 0",
              minWidth: "220px",
              maxHeight: "280px",
              overflowY: "auto",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
            }}>
              {supportedLanguages.map((language, index) => (
                <div key={language.code}>
                  {index === 12 && (
                    <div style={{
                      padding: "8px 16px",
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.5)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      marginTop: "4px",
                      paddingTop: "8px"
                    }}>
                      International Languages
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      setShowLanguageDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      backgroundColor: selectedLanguage === language.code 
                        ? "rgba(102, 126, 234, 0.3)" 
                        : "transparent",
                      border: "none",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLanguage !== language.code) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLanguage !== language.code) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {index < 12 ? "🇮🇳" : "🌐"} {language.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(180deg, rgba(15, 52, 96, 0) 0%, rgba(15, 52, 96, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        padding: "20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          gap: "12px",
          alignItems: "flex-end"
        }}>
          <div style={{
            flex: 1,
            position: "relative"
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Send message..."
              style={{
                width: "100%",
                minHeight: "50px",
                maxHeight: "100px",
                padding: "14px 90px 14px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "25px",
                color: "white",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
                resize: "none",
                backdropFilter: "blur(10px)"
              }}
              disabled={loading}
            />
            
            <button
              onClick={toggleVoiceRecognition}
              disabled={loading}
              style={{
                position: "absolute",
                right: "46px",
                top: "50%",
                width: "34px",
                height: "34px",
                backgroundColor: isListening 
                  ? "rgba(239, 68, 68, 0.8)" 
                  : "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: isListening ? "0 0 20px rgba(239, 68, 68, 0.5)" : "none",
                transform: isListening ? "translateY(-50%) scale(1.05)" : "translateY(-50%)"
              }}
            >
              {isListening ? (
                <StopIcon style={{ width: "18px", height: "18px" }} />
              ) : (
                <MicrophoneIcon style={{ width: "18px", height: "18px" }} />
              )}
            </button>
            
            {/* Language Picker Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  padding: "6px 8px",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: showLanguageDropdown ? "0 0 10px rgba(102, 126, 234, 0.4)" : "none"
                }}
              >
                🇮🇳
              </button>
              
              {showLanguageDropdown && (
                <div style={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  marginBottom: "12px",
                  backgroundColor: "rgba(26, 26, 46, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "8px 0",
                  minWidth: "220px",
                  maxHeight: "280px",
                  overflowY: "auto",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                  zIndex: 1001
                }}>
                  {supportedLanguages.map((language, index) => (
                    <div key={language.code}>
                      {index === 12 && (
                        <div style={{
                          padding: "8px 16px",
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.5)",
                          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                          marginTop: "4px",
                          paddingTop: "8px"
                        }}>
                          International Languages
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setShowLanguageDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 16px",
                          backgroundColor: selectedLanguage === language.code 
                            ? "rgba(102, 126, 234, 0.3)" 
                            : "transparent",
                          border: "none",
                          color: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedLanguage !== language.code) {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedLanguage !== language.code) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {index < 12 ? "🇮🇳" : "🌐"} {language.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleTextSubmit(inputText)}
            disabled={!inputText.trim() || loading}
            style={{
              width: "50px",
              height: "50px",
              background: inputText.trim() 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              color: "white",
              cursor: inputText.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              opacity: inputText.trim() ? 1 : 0.5,
              boxShadow: inputText.trim() ? "0 4px 20px rgba(102, 126, 234, 0.4)" : "none"
            }}
          >
            <PaperAirplaneIcon style={{ width: "20px", height: "20px" }} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(239, 68, 68, 0.9)",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 1000,
          backdropFilter: "blur(10px)"
        }}>
          {error}
        </div>
      )}

      {popup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "24px", color: "white" }}>{popup.title}</h3>
            <p style={{ margin: "0 0 24px 0", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.5" }}>{popup.message}</p>
            <button
              onClick={() => setPopup(null)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
