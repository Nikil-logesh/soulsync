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
        guestMode,
        userPreferences: user?.preferences
      };

      const response = await aiService.generateResponse(transcript, context);
      
      const aiMessage = {
        id: `ai-${++messageIdRef.current}`,
        type: 'ai' as const,
        content: response.message,
        timestamp: new Date(),
        language: response.language || 'en'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Handle any actions from the AI response
      if (response.actions) {
        for (const action of response.actions) {
          if (action.type === 'show_popup') {
            setPopup(action.data);
          }
        }
      }
      
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        id: `ai-${++messageIdRef.current}`,
        type: 'ai' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Simple Header */}
      <header style={{
        backgroundColor: '#4169e1',
        color: 'white',
        padding: '15px 20px',
        borderBottom: '2px solid #365ac7'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', display: 'inline-block' }}>
          SoulSync AI Chat
        </h1>
        <div style={{ float: 'right' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '5px 15px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Home
          </button>
          {user && (
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                padding: '5px 15px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Dashboard
            </button>
          )}
        </div>
        <div style={{ clear: 'both' }}></div>
      </header>

      {/* Chat Container */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Messages Area */}
        <div style={{
          border: '2px solid #ddd',
          backgroundColor: '#f9f9f9',
          minHeight: '400px',
          padding: '15px',
          marginBottom: '20px',
          overflow: 'auto'
        }}>
          {messages.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '50px 20px',
              fontSize: '16px'
            }}>
              <h3 style={{ color: '#4169e1', marginBottom: '10px' }}>
                Welcome to SoulSync AI Mental Health Support
              </h3>
              <p>Start a conversation by speaking or typing below.</p>
              <p style={{ fontSize: '14px', marginTop: '20px' }}>
                {user ? 'You are signed in' : 'You are using guest mode'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                border: message.type === 'user' ? '1px solid #4169e1' : '1px solid #28a745',
                backgroundColor: message.type === 'user' ? '#f0f4ff' : '#f0fff0'
              }}
            >
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '5px'
              }}>
                <strong>{message.type === 'user' ? 'You' : 'SoulSync AI'}</strong>
                <span style={{ float: 'right' }}>{formatTime(message.timestamp)}</span>
                <div style={{ clear: 'both' }}></div>
              </div>
              <div style={{
                fontSize: '14px',
                lineHeight: '1.4',
                color: '#333'
              }}>
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{
              padding: '10px',
              border: '1px solid #28a745',
              backgroundColor: '#f0fff0',
              color: '#666',
              fontSize: '14px'
            }}>
              SoulSync AI is thinking...
            </div>
          )}

          {error && (
            <div style={{
              padding: '10px',
              border: '1px solid #dc3545',
              backgroundColor: '#fff5f5',
              color: '#dc3545',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Voice Input Area */}
        <div style={{
          border: '2px solid #4169e1',
          backgroundColor: '#f8f9ff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#4169e1', marginBottom: '15px', fontSize: '18px' }}>
            Voice Input
          </h3>
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            disabled={loading}
          />
        </div>

        {/* Location Detection */}
        {!location && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ffa500',
            backgroundColor: '#fff8e1',
            textAlign: 'center'
          }}>
            <p style={{ color: '#333', marginBottom: '10px' }}>
              Enable location for personalized local mental health resources
            </p>
            <button
              onClick={detectLocation}
              style={{
                backgroundColor: '#ffa500',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Enable Location
            </button>
          </div>
        )}

        {location && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #28a745',
            backgroundColor: '#f0fff0',
            fontSize: '14px',
            color: '#666'
          }}>
            Location: {location.city}, {location.state}, {location.country}
          </div>
        )}
      </div>

      {/* Popup */}
      {popup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            border: '2px solid #4169e1',
            maxWidth: '500px',
            margin: '20px'
          }}>
            <h3 style={{ color: '#4169e1', marginBottom: '15px' }}>
              {popup.title || 'Information'}
            </h3>
            <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
              {popup.content}
            </div>
            <button
              onClick={() => setPopup(null)}
              style={{
                backgroundColor: '#4169e1',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px'
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