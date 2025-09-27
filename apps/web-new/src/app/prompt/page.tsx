"use client";

import { useState, useRef } from "react";
import { useLocation } from "../../hooks/useLocation";
import VoiceInput from "../../components/VoiceInput";
import { useAuth } from "../../contexts/AuthContext";
import { aiService } from "../../lib/aiService";

export default function PromptPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    language?: string;
  }>>([]);
  const [popup, setPopup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messageIdRef = useRef(0);
  
  const { location, detectLocation } = useLocation();

  const handleVoiceTranscript = async (transcript: string, language: string = 'en-US') => {
    // Add user message to chat
    const userMessage = {
      id: `user-${++messageIdRef.current}`,
      type: 'user' as const,
      content: transcript,
      timestamp: new Date(),
      language: language
    };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    setError("");
    setPopup(null);

    try {
      const guestMode = !user;
      
      // Build context object for AI service
      const context = {
        location: location ? {
          country: location.country,
          state: location.state,
          city: location.city
        } : undefined,
        language: language,
        guestMode: guestMode
      };

      // Use AI service for intelligent responses
      const data = await aiService.generateResponse(transcript, context);

      if (data.action === "popup") {
        setPopup(data);
      } else {
        // Add AI response to chat
        const aiMessage = {
          id: `ai-${++messageIdRef.current}`,
          type: 'ai' as const,
          content: data.message,
          timestamp: new Date(),
          language: language
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setError("Failed to generate AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '36px', 
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>Hi Buddy... Share what's in your mind</h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.5'
          }}>
            Your AI companion is here to listen and support you 24/7
          </p>

          {/* Location Context Indicator */}
          {location && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginTop: '16px',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ marginRight: '8px' }}>📍</span>
              Providing support for {location.city}, {location.state}
            </div>
          )}
        </div>
      </section>

      {/* Main Chat Container */}
      <main style={{ 
        maxWidth: '1000px', 
        margin: '-30px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Chat Messages */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          minHeight: '500px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f7fafc',
            borderRadius: '20px 20px 0 0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  🤖
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    SoulSync AI Assistant
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    color: '#718096'
                  }}>
                    Online • Ready to help
                  </p>
                </div>
              </div>
              
              {!location && (
                <button
                  onClick={detectLocation}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📍 Detect Location
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '32px',
            maxHeight: '400px',
            overflowY: 'auto',
            minHeight: '300px'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#718096'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginBottom: '20px'
                }}>
                  💭
                </div>
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Start Your Conversation
                </h4>
                <p style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Share what's on your mind. I'm here to listen and provide support.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '16px 20px',
                      borderRadius: message.type === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                      backgroundColor: message.type === 'user' ? '#10b981' : '#f7fafc',
                      color: message.type === 'user' ? 'white' : '#2d3748',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      border: message.type === 'ai' ? '1px solid #e2e8f0' : 'none'
                    }}>
                      {message.content}
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        opacity: 0.7
                      }}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      borderRadius: '20px 20px 20px 8px',
                      backgroundColor: '#f7fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      color: '#718096'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          animation: 'pulse 1.5s infinite'
                        }}></div>
                        AI is typing...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice Input Area */}
          <div style={{
            padding: '24px 32px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#fafafa',
            borderRadius: '0 0 20px 20px'
          }}>
            <VoiceInput onTranscript={handleVoiceTranscript} />
            
            {error && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Emergency Support Card */}
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h4 style={{
            color: '#dc2626',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            🚨 Need Immediate Help?
          </h4>
          <p style={{
            color: '#991b1b',
            fontSize: '14px',
            marginBottom: '12px'
          }}>
            If you're experiencing a mental health emergency, please reach out to professionals immediately.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <a
              href="tel:988"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Crisis Hotline: 988
            </a>
            <a
              href="tel:911"
              style={{
                backgroundColor: '#7c2d12',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Emergency: 911
            </a>
          </div>
        </div>
      </main>

      {/* Popup Modal */}
      {popup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              {popup.title}
            </h3>
            <p style={{
              color: '#4a5568',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              {popup.message}
            </p>
            <button
              onClick={() => setPopup(null)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}