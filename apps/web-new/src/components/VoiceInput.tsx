'use client';

import React, { useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, placeholder = "Type your message...", disabled }: VoiceInputProps) {
  const [textInput, setTextInput] = useState('');

  const handleSubmit = () => {
    if (textInput.trim()) {
      onTranscript(textInput.trim());
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg text-gray-500">
              <MicrophoneIcon className="h-4 w-4" />
              <span>Voice feature temporarily disabled</span>
            </div>
            {textInput.trim() && (
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Text
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
