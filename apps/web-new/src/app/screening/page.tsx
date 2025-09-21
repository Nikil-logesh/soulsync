"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import PHQ9Screening from '@/components/PHQ9Screening';
import GAD7Screening from '@/components/GAD7Screening';
import GHQ12Screening from '@/components/GHQ12Screening';
import ScreeningResults from '@/components/ScreeningResults';
import { ScreeningResult } from '@/types/screening';

const screeningOptions = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    fullName: 'Depression Screening for Indian Youth',
    description: 'Confidential assessment for depression symptoms. Designed to understand mood challenges faced by Indian students and young adults including academic pressure and family expectations.',
    icon: '🧠',
    color: 'from-blue-500 to-purple-500',
    questions: 9,
    duration: '3-5 minutes',
    category: 'Depression & Mood'
  },
  {
    id: 'gad7',
    name: 'GAD-7',
    fullName: 'Anxiety Screening for Indian Youth',
    description: 'Check anxiety levels related to exams, career pressure, family expectations, and social situations. Completely stigma-free and culturally sensitive assessment.',
    icon: '😰',
    color: 'from-green-500 to-teal-500',
    questions: 7,
    duration: '2-4 minutes',
    category: 'Anxiety & Stress'
  },
  {
    id: 'ghq12',
    name: 'GHQ-12',
    fullName: 'Overall Mental Wellness Check for Youth',
    description: 'Comprehensive mental health screening for Indian youth. Covers academic stress, family dynamics, social pressure, and overall psychological wellbeing.',
    icon: '🌡️',
    color: 'from-orange-500 to-red-500',
    questions: 12,
    duration: '4-6 minutes',
    category: 'General Mental Health'
  }
];

export default function ScreeningHub() {
  const { user } = useAuth();
  const [selectedScreening, setSelectedScreening] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ScreeningResult | null>(null);

  const handleScreeningSelect = (screeningId: string) => {
    setSelectedScreening(screeningId);
  };

  const handleScreeningComplete = (result: ScreeningResult) => {
    // Add screening type to result
    let screeningType: 'PHQ-9' | 'GAD-7' | 'GHQ-12' = 'PHQ-9';
    if (selectedScreening === 'phq9') screeningType = 'PHQ-9';
    else if (selectedScreening === 'gad7') screeningType = 'GAD-7';
    else if (selectedScreening === 'ghq12') screeningType = 'GHQ-12';

    setResults({ ...result, screeningType });
    setShowResults(true);
  };

  const handleCancel = () => {
    setSelectedScreening(null);
    setShowResults(false);
  };

  const handleRetakeTest = () => {
    setShowResults(false);
    setResults(null);
  };

  const handleSaveResults = async () => {
    if (!results || !user) return;

    try {
      const response = await fetch('/api/screening-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screeningType: results.screeningType,
          totalScore: results.totalScore,
          answers: results.answers,
          interpretation: results.interpretation,
          severity: results.severity,
          recommendations: results.recommendations
        })
      });

      if (response.ok) {
        // Show success message
        alert('Results saved successfully!');
      } else {
        alert('Failed to save results. Please try again.');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  const handleViewResources = () => {
    // Navigate to resources page based on results
    window.location.href = `/resources?severity=${results?.severity}&type=${results?.screeningType}`;
  };

  // Show screening component if one is selected
  if (selectedScreening && !showResults) {
    const language = 'en'; // Default language since we don't have user preferences in Firebase yet
    
    if (selectedScreening === 'phq9') {
      return (
        <PHQ9Screening
          language={language}
          onComplete={handleScreeningComplete}
          onCancel={handleCancel}
        />
      );
    } else if (selectedScreening === 'gad7') {
      return (
        <GAD7Screening
          language={language}
          onComplete={handleScreeningComplete}
          onCancel={handleCancel}
        />
      );
    } else if (selectedScreening === 'ghq12') {
      return (
        <GHQ12Screening
          language={language}
          onComplete={handleScreeningComplete}
          onCancel={handleCancel}
        />
      );
    } else {
      // Unknown screening type
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Screening Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested screening assessment is not available.
          </p>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Screening Options
          </button>
        </div>
      );
    }
  }

  // Show results if screening is completed
  if (showResults && results) {
    return (
      <ScreeningResults
        result={results}
        onRetakeTest={handleRetakeTest}
        onViewResources={handleViewResources}
        onSaveResults={user ? handleSaveResults : undefined}
      />
    );
  }

  // Main screening selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mental Health Screening Hub
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose from validated mental health assessment tools
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              These scientifically validated screening tools help identify symptoms and provide personalized recommendations. 
              All assessments are confidential and designed to support your mental wellness journey.
            </p>
          </div>
        </motion.div>

        {/* User Status */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 mb-8 border border-blue-200"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">
                  {user.email?.charAt(0).toUpperCase() || '👤'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Welcome back, {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-600">
                  Your results will be saved securely for progress tracking
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-200"
          >
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800">Guest Mode</p>
                <p className="text-sm text-yellow-700">
                  Sign in to save your results and track progress over time
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screening Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {screeningOptions.map((screening, index) => (
            <motion.div
              key={screening.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleScreeningSelect(screening.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${screening.color} p-6 text-white`}>
                <div className="text-4xl mb-3">{screening.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{screening.name}</h3>
                <p className="text-blue-100 text-sm">{screening.fullName}</p>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {screening.category}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {screening.description}
                </p>

                {/* Quick Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📝</span>
                    <span>{screening.questions} questions</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏱️</span>
                    <span>{screening.duration}</span>
                  </div>
                </div>

                {/* Start Button */}
                <button className={`w-full py-3 bg-gradient-to-r ${screening.color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                  Start Assessment
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Important Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🔒</span>
                Privacy & Confidentiality
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• All responses are kept strictly confidential</li>
                <li>• No personally identifiable information is shared</li>
                <li>• Results are used only for your personal wellness journey</li>
                <li>• You can delete your data at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                How These Tools Work
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Scientifically validated questionnaires</li>
                <li>• Used by healthcare professionals worldwide</li>
                <li>• Provide screening, not diagnosis</li>
                <li>• Results include personalized recommendations</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Disclaimer:</strong> These screening tools are for educational and informational purposes only. 
              They do not replace professional medical diagnosis or treatment. If you're experiencing severe symptoms 
              or thoughts of self-harm, please seek immediate professional help.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}