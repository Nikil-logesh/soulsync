'use client';

import React, { useState, useEffect, useRef } from 'react';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string, language?: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, placeholder = "Type your message...", disabled }: VoiceInputProps) {
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTextInput(prev => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
          // Auto-submit voice input with language context
          onTranscript(transcript, selectedLanguage);
          setTextInput(''); // Clear after voice input
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, [selectedLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !disabled) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = () => {
    if (textInput.trim()) {
      onTranscript(textInput.trim(), selectedLanguage);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          minHeight: '120px',
          padding: '20px',
          border: '2px dashed #ddd',
          backgroundColor: '#f9f9f9',
          position: 'relative'
        }}>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              height: '60px',
              padding: '0',
              backgroundColor: 'transparent',
              border: 'none',
              resize: 'none',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: '#333'
            }}
          />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  disabled={disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    color: '#1976d2',
                    fontSize: '14px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1
                  }}
                >
                  <span>🌐</span>
                  <span>{selectedLang.flag}</span>
                  <span>{selectedLang.name}</span>
                </button>
                
                {showLanguageDropdown && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    marginBottom: '8px',
                    left: '0',
                    width: '250px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    zIndex: 50
                  }}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          backgroundColor: selectedLanguage === lang.code ? '#e3f2fd' : 'white',
                          color: selectedLanguage === lang.code ? '#1976d2' : '#333',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedLanguage !== lang.code) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedLanguage !== lang.code) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Input Button */}
              {isSupported ? (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: isListening ? '#f44336' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    fontSize: '14px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1
                  }}
                >
                  <span>{isListening ? '🛑' : '🎤'}</span>
                  <span>{isListening ? 'Stop' : 'Voice'}</span>
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#f5f5f5',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  <span>🎤</span>
                  <span>Voice not supported</span>
                </div>
              )}
            </div>

            {textInput.trim() && (
              <button
                onClick={handleSubmit}
                disabled={disabled}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  fontSize: '14px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1
                }}
              >
                Send
              </button>
            )}
          </div>
        </div>
        
        {isListening && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid #4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: '#4caf50' }}>
                🎤 Listening...
              </div>
              <div style={{ fontSize: '14px', color: '#333' }}>
                Speak now in {selectedLang.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}