"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "../../hooks/useLocation";
import { useAuth } from "../../contexts/AuthContext";
import { aiService } from "../../lib/aiService";
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from "@heroicons/react/24/outline";

export default function PromptPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    language?: string;
  }>>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const recognition = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { location: userLocation } = useLocation();

  const supportedLanguages = [
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'ur-IN', name: 'Urdu' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'pa-IN', name: 'Punjabi' },
    { code: 'or-IN', name: 'Odia' },
    { code: 'as-IN', name: 'Assamese' },
    { code: 'en-US', name: 'English' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-PT', name: 'Portuguese' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ar-SA', name: 'Arabic' }
  ];

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = selectedLanguage;

      recognition.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInputText(prev => prev + finalTranscript + ' ');
        }
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputText.trim(),
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const userContext = {
        location: userLocation,
        language: selectedLanguage
      };
      
      const response = await aiService.generateResponse(
        inputText.trim(), 
        userContext
      );
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: response.message, // Extract message from AIResponse
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    if (!recognition.current) return;

    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      recognition.current.lang = selectedLanguage;
      recognition.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(26, 26, 46, 0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              AI Mental Health Support
            </h1>
            <p style={{
              margin: "4px 0 0 0",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)"
            }}>
              Your compassionate AI companion for mental wellness
            </p>
          </div>
          {user && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold"
              }}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        minHeight: "calc(100vh - 200px)",
        paddingBottom: "120px"
      }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: message.type === 'user' ? "flex-end" : "flex-start",
                marginBottom: "16px"
              }}
            >
              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: message.type === 'user' ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: message.type === 'user' 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
              }}>
                <p style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: "1.5",
                  color: message.type === 'user' ? "white" : "rgba(255, 255, 255, 0.9)"
                }}>
                  {message.content}
                </p>
                <div style={{
                  fontSize: "12px",
                  color: message.type === 'user' 
                    ? "rgba(255, 255, 255, 0.7)" 
                    : "rgba(255, 255, 255, 0.5)",
                  marginTop: "4px",
                  textAlign: "right"
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.language && (
                    <span style={{ marginLeft: "8px" }}>
                      {supportedLanguages.find(lang => lang.code === message.language)?.name}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px"
            }}
          >
            <div style={{
              maxWidth: "70%",
              padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}></div>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.2s"
                }}></div>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.4s"
                }}></div>
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
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                background: "transparent"
              }}
            />
            
            {/* Right-side buttons container */}
            <div style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              {/* Language Selector */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "12px",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    boxShadow: showLanguageDropdown ? "0 4px 20px rgba(102, 126, 234, 0.4)" : "none"
                  }}
                >
                  {selectedLanguage.startsWith('hi') ? '🇮🇳' : 
                   selectedLanguage.startsWith('en') ? '🇺🇸' :
                   selectedLanguage.startsWith('es') ? '🇪🇸' :
                   selectedLanguage.startsWith('fr') ? '🇫🇷' :
                   selectedLanguage.startsWith('de') ? '🇩🇪' : '🌐'}
                </button>
                
                {showLanguageDropdown && (
                  <div style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    marginBottom: "8px",
                    backgroundColor: "rgba(26, 26, 46, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "8px 0",
                    minWidth: "200px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    zIndex: 1000
                  }}>
                    {supportedLanguages.map((language, index) => (
                      <div key={language.code}>
                        {index === 12 && (
                          <div style={{
                            padding: "8px 16px",
                            fontSize: "11px",
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
                            padding: "8px 16px",
                            backgroundColor: selectedLanguage === language.code 
                              ? "rgba(102, 126, 234, 0.3)" 
                              : "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "13px",
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

              {/* Voice Button */}
              <button
                onClick={toggleRecording}
                disabled={!recognition.current}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: isRecording 
                    ? "rgba(239, 68, 68, 0.2)" 
                    : "rgba(255, 255, 255, 0.1)",
                  border: isRecording 
                    ? "1px solid rgba(239, 68, 68, 0.5)" 
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  color: isRecording ? "#ef4444" : "white",
                  cursor: recognition.current ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(10px)",
                  opacity: recognition.current ? 1 : 0.5,
                  boxShadow: isRecording ? "0 4px 20px rgba(239, 68, 68, 0.4)" : "none"
                }}
              >
                {isRecording ? (
                  <StopIcon style={{ width: "16px", height: "16px" }} />
                ) : (
                  <MicrophoneIcon style={{ width: "16px", height: "16px" }} />
                )}
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim() || isLoading}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: inputText.trim() && !isLoading 
                ? "linear-gradient(135deg, #ff8a50 0%, #ff6b35 50%, #e74c3c 100%)" 
                : "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              color: "white",
              cursor: inputText.trim() && !isLoading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              opacity: inputText.trim() && !isLoading ? 1 : 0.5,
              boxShadow: inputText.trim() && !isLoading 
                ? "0 6px 25px rgba(255, 138, 80, 0.5), 0 2px 10px rgba(255, 107, 53, 0.3)" 
                : "none",
              transform: inputText.trim() && !isLoading ? "scale(1.02)" : "scale(1)"
            }}
            onMouseEnter={(e) => {
              if (inputText.trim() && !isLoading) {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(255, 138, 80, 0.6), 0 4px 15px rgba(255, 107, 53, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (inputText.trim() && !isLoading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(255, 138, 80, 0.5), 0 2px 10px rgba(255, 107, 53, 0.3)";
              }
            }}
          >
            <PaperAirplaneIcon style={{ 
              width: "18px", 
              height: "18px",
              transform: "rotate(315deg) translateX(1px)",
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
            }} />
          </button>
        </div>
      </div>

      <div ref={messagesEndRef} />

      <style jsx>{`
        @keyframes pulse {
          0%, 70%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          35% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}