"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ScreeningResult } from '@/types/screening';
import AnimatedFace from '@/components/AnimatedFace';

interface ScreeningResultsProps {
  result: ScreeningResult;
  onRetakeTest?: () => void;
  onViewResources?: () => void;
  onSaveResults?: () => void;
}

export default function ScreeningResults({ 
  result, 
  onRetakeTest, 
  onViewResources, 
  onSaveResults 
}: ScreeningResultsProps) {
  const { data: session } = useSession();
  const [location, setLocation] = useState<any>(null);
  const [culturalRecommendations, setCulturalRecommendations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [nextTestInfo, setNextTestInfo] = useState<any>(null);
  const [characterExpression, setCharacterExpression] = useState<"neutral" | "happy" | "sad" | "surprised">("neutral");

  useEffect(() => {
    // Set character expression based on severity
    switch (result.severity.toLowerCase()) {
      case 'good':
      case 'minimal':
      case 'minimal distress':
        setCharacterExpression('happy');
        break;
      case 'severe':
      case 'significant distress':
        setCharacterExpression('sad');
        break;
      case 'moderate':
      case 'moderate distress':
        setCharacterExpression('surprised');
        break;
      default:
        setCharacterExpression('neutral');
    }
  }, [result.severity]);

  useEffect(() => {
    // Get user's location for cultural recommendations
    const userLocation = session?.user?.locationData;
    if (userLocation) {
      setLocation(userLocation);
      generateCulturalRecommendations(result.severity, userLocation);
    }
  }, [session, result.severity]);

  const handleSaveResults = async () => {
    if (!session?.user?.email) {
      alert('Please sign in to save your results');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/screening-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screeningType: result.screeningType,
          totalScore: result.totalScore,
          answers: result.answers,
          interpretation: result.interpretation,
          severity: result.severity,
          recommendations: result.recommendations,
          culturalRecommendations: culturalRecommendations,
          completedAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save results');
      }

      setSaveStatus('success');
      setNextTestInfo(data.data);
      
      // Call the optional onSaveResults prop if provided
      if (onSaveResults) {
        onSaveResults();
      }

    } catch (error) {
      console.error('Error saving results:', error);
      setSaveStatus('error');
      alert(error instanceof Error ? error.message : 'Failed to save results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const generateCulturalRecommendations = (severity: string, locationData: any) => {
    const { country, state } = locationData;
    let cultural: string[] = [];

    if (country === 'India') {
      // Base Indian cultural recommendations
      cultural.push("Consider discussing your feelings with trusted family elders - their wisdom and support can be very healing");
      
      if (state === 'Tamil Nadu') {
        cultural.push("Visit a nearby temple for peaceful meditation - the Carnatic music and atmosphere can be soothing");
        cultural.push("Practice drawing kolam patterns - the repetitive, creative process can be meditative and calming");
        cultural.push("Enjoy classical Tamil music or Bharatanatyam - these art forms have therapeutic benefits");
        cultural.push("Share your concerns over filter coffee with close family members - this traditional bonding can provide emotional support");
      } else if (state === 'Karnataka') {
        cultural.push("Visit Lalbagh or Cubbon Park for nature therapy - green spaces can improve mood significantly");
        cultural.push("Practice yoga in the early morning - it's deeply rooted in Indian culture and scientifically proven for mental wellness");
        cultural.push("Listen to devotional music or attend cultural programs - community participation builds emotional resilience");
      } else if (state === 'Kerala') {
        cultural.push("Consider Ayurvedic wellness practices - they offer holistic approaches to mental health");
        cultural.push("Spend time in nature - Kerala's backwaters and greenery have natural healing properties");
        cultural.push("Practice pranayama (breathing exercises) - these traditional techniques are excellent for anxiety");
      } else if (state === 'Maharashtra') {
        cultural.push("Visit peaceful places like Marine Drive for reflection and sea therapy");
        cultural.push("Engage in community activities during festivals - social connection is vital for mental health");
        cultural.push("Practice meditation techniques that originated in Maharashtra's spiritual traditions");
      }

      // Common Indian recommendations based on severity
      if (severity === 'severe' || severity === 'moderately_severe') {
        cultural.push("Reach out to family support systems - Indian joint families provide natural mental health support");
        cultural.push("Consider consulting with both modern mental health professionals and traditional healers who understand your cultural context");
      } else {
        cultural.push("Join community activities like bhajan groups, cultural clubs, or volunteer work - serving others often helps with personal healing");
        cultural.push("Practice traditional Indian stress relief methods like oil massage, warm baths with herbs, or aromatherapy with Indian spices");
      }
    } else {
      // International recommendations
      cultural.push("Connect with your cultural community for support and understanding");
      cultural.push("Practice traditional wellness methods from your heritage alongside modern approaches");
      cultural.push("Seek mental health professionals who understand your cultural background");
    }

    setCulturalRecommendations(cultural);
  };

  const getHelplineRecommendations = (severity: string) => {
    const helplines = [];
    
    if (severity === 'severe' || severity === 'moderately_severe' || severity === 'Significant Distress') {
      helplines.push({
        name: "KIRAN National Helpline",
        number: "1800-599-0019",
        description: "24x7 multilingual crisis support"
      });
      helplines.push({
        name: "Tele Manas",
        number: "14416",
        description: "Government mental health counseling"
      });
      helplines.push({
        name: "Vandrevala Foundation",
        number: "+91 9999 666 555",
        description: "24x7 crisis counseling"
      });
    } else if (severity === 'moderate' || severity === 'Moderate Distress') {
      helplines.push({
        name: "Tele Manas",
        number: "14416",
        description: "Professional counseling support"
      });
      helplines.push({
        name: "NIMHANS Helpline",
        number: "080-46110007",
        description: "Medical advice and counseling"
      });
    }
    
    return helplines;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'good': return 'text-green-600 bg-green-100';
      case 'mild':
      case 'mild distress': return 'text-yellow-600 bg-yellow-100';
      case 'moderate':
      case 'moderate distress': return 'text-orange-600 bg-orange-100';
      case 'moderately_severe':
      case 'significant distress': return 'text-red-600 bg-red-100';
      case 'severe': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'good': return '😊';
      case 'mild':
      case 'mild distress': return '😐';
      case 'moderate':
      case 'moderate distress': return '😟';
      case 'moderately_severe':
      case 'significant distress': return '😰';
      case 'severe': return '🆘';
      default: return '📊';
    }
  };

  const getScoreInterpretation = () => {
    const { screeningType, totalScore } = result;
    
    if (screeningType === 'PHQ-9') {
      return `Your PHQ-9 score is ${totalScore} out of 27`;
    } else if (screeningType === 'GAD-7') {
      return `Your GAD-7 score is ${totalScore} out of 21`;
    } else {
      return `Your screening score is ${totalScore}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <AnimatedFace 
          expression={characterExpression} 
          talking={isSaving}
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-4">
          {result.screeningType} Results
        </h1>
        <p className="text-gray-600">
          {getScoreInterpretation()}
        </p>
      </motion.div>

      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
      >
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${getSeverityColor(result.severity)}`}>
            {result.interpretation}
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {result.totalScore}
          </div>
          <p className="text-gray-600">
            Total Score
          </p>
        </div>

        {/* Score Visualization */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              className={`h-4 rounded-full ${
                result.severity === 'minimal' ? 'bg-green-500' :
                result.severity === 'mild' ? 'bg-yellow-500' :
                result.severity === 'moderate' ? 'bg-orange-500' :
                result.severity === 'moderately_severe' ? 'bg-red-500' :
                'bg-red-700'
              }`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${result.screeningType === 'PHQ-9' ? 
                  (result.totalScore / 27) * 100 : 
                  (result.totalScore / 21) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* General Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          General Recommendations
        </h2>
        <div className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start"
            >
              <span className="text-blue-500 mt-1 mr-3 text-sm">•</span>
              <p className="text-blue-800">{rec}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cultural Recommendations */}
      {culturalRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-purple-50 border border-purple-200 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
            <span className="mr-2">🏛️</span>
            Cultural Wellness Suggestions
          </h2>
          {location && (
            <p className="text-purple-700 mb-4 text-sm">
              Personalized for {location.city}, {location.state}, {location.country}
            </p>
          )}
          <div className="space-y-3">
            {culturalRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start"
              >
                <span className="text-purple-500 mt-1 mr-3 text-sm">•</span>
                <p className="text-purple-800">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mental Health Helplines */}
      {getHelplineRecommendations(result.severity).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
            <span className="mr-2">📞</span>
            Mental Health Support Helplines
          </h2>
          <div className="space-y-4">
            {getHelplineRecommendations(result.severity).map((helpline, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-green-300">
                <h3 className="font-semibold text-green-800 mb-1">{helpline.name}</h3>
                <a
                  href={`tel:${helpline.number}`}
                  className="text-2xl font-bold text-green-600 hover:text-green-700 block mb-1"
                >
                  {helpline.number}
                </a>
                <p className="text-green-700 text-sm">{helpline.description}</p>
              </div>
            ))}
            <div className="text-center">
              <a
                href="/emergency"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                View All Emergency Resources →
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Emergency Resources */}
      {(result.severity === 'severe' || result.severity === 'moderately_severe' || result.severity === 'Significant Distress') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-red-800 mb-4 flex items-center">
            <span className="mr-2">🆘</span>
            Immediate Support Resources
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-300">
              <h3 className="font-semibold text-red-800 mb-2">Crisis Helplines</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>National Suicide Prevention Lifeline:</strong> 
                  <a href="tel:988" className="text-red-600 ml-2 font-mono">988</a>
                </div>
                <div>
                  <strong>Crisis Text Line:</strong> 
                  <span className="text-red-600 ml-2 font-mono">Text HOME to 741741</span>
                </div>
                {location?.country === 'India' && (
                  <div>
                    <strong>iCall Psychosocial Helpline (India):</strong> 
                    <a href="tel:+919152987821" className="text-red-600 ml-2 font-mono">+91 91529 87821</a>
                  </div>
                )}
              </div>
            </div>
            <p className="text-red-700 text-sm">
              <strong>Important:</strong> If you're having thoughts of self-harm or suicide, please reach out for immediate help. You are not alone, and support is available.
            </p>
          </div>
        </motion.div>
      )}

      {/* Retesting Information */}
      {nextTestInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📅 Your Mental Health Journey</h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-700">
              <strong>Next recommended test:</strong> {new Date(nextTestInfo.nextTestRecommended).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-blue-700">
              <strong>Can retake after:</strong> {new Date(nextTestInfo.canRetakeAfter).toLocaleDateString()}
            </p>
            <p className="text-blue-600 italic">{nextTestInfo.retestingAdvice}</p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {session?.user?.email && (
          <button
            onClick={handleSaveResults}
            disabled={isSaving || saveStatus === 'success'}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
              saveStatus === 'success' 
                ? 'bg-green-600 text-white' 
                : isSaving 
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveStatus === 'success' ? (
              <>
                <span className="mr-2">✅</span>
                Results Saved
              </>
            ) : (
              <>
                <span className="mr-2">💾</span>
                Save to Profile
              </>
            )}
          </button>
        )}
        
        {onViewResources && (
          <button
            onClick={onViewResources}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <span className="mr-2">📚</span>
            View Resources
          </button>
        )}
        
        {onRetakeTest && (
          <button
            onClick={onRetakeTest}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            Retake Assessment
          </button>
        )}
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center p-6 bg-gray-50 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">What's Next?</h3>
        <p className="text-gray-600 mb-4">
          Your mental wellness journey is unique. Consider exploring our personalized resources and connecting with professional support when needed.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">📖 Educational Resources</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">🧘‍♀️ Mindfulness Tools</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">🗣️ Community Support</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">👨‍⚕️ Professional Help</span>
        </div>
      </motion.div>
    </div>
  );
}