'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, StopIcon, LanguageIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-4">
      <div className="relative">
        <div className="min-h-[120px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="w-full h-16 p-0 bg-transparent border-none resize-none focus:outline-none text-gray-700"
            disabled={disabled}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  disabled={disabled}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LanguageIcon className="h-4 w-4" />
                  <span>{selectedLang.flag}</span>
                  <span className="hidden sm:inline">{selectedLang.name}</span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 w-64 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          selectedLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <StopIcon className="h-4 w-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <MicrophoneIcon className="h-4 w-4" />
                      <span>Voice</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-200 rounded-lg text-gray-500 text-sm">
                  <MicrophoneIcon className="h-4 w-4" />
                  <span>Voice not supported</span>
                </div>
              )}
            </div>

            {textInput.trim() && (
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            )}
          </div>
        </div>
        
        {isListening && (
          <div className="absolute inset-0 bg-green-50 border-2 border-green-400 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse text-green-600 text-lg mb-2">🎤 Listening...</div>
              <div className="text-green-700 text-sm">Speak now in {selectedLang.name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
