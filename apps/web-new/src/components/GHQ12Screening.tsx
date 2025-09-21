"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreeningResult, Question, ScreeningProps } from '@/types/screening';
import AnimatedFace from '@/components/AnimatedFace';

const GHQ12_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Have you recently been able to concentrate on whatever you're doing?",
    textTamil: "சமீபத்தில் நீங்கள் செய்யும் வேலையில் கவனம் செலுத்த முடிகிறதா?",
    textHindi: "क्या आप हाल ही में अपने काम पर ध्यान केंद्रित कर पा रहे हैं?"
  },
  {
    id: 2,
    text: "Have you recently lost much sleep over worry?",
    textTamil: "சமீபத்தில் கவலையால் உங்களுக்கு தூக்கம் வரவில்லையா?",
    textHindi: "क्या आपकी हाल ही में चिंता के कारण नींद उड़ी है?"
  },
  {
    id: 3,
    text: "Have you recently felt that you are playing a useful part in things?",
    textTamil: "சமீபத்தில் நீங்கள் பயனுள்ள பங்கு வகிக்கிறீர்கள் என்று உணர்கிறீர்களா?",
    textHindi: "क्या आपको हाल ही में लगा है कि आप चीजों में उपयोगी भूमिका निभा रहे हैं?"
  },
  {
    id: 4,
    text: "Have you recently felt capable of making decisions about things?",
    textTamil: "சமீபத்தில் விஷயங்களில் முடிவு எடுக்கும் திறன் உங்களிடம் இருப்பதாக உணர்கிறீர்களா?",
    textHindi: "क्या आपको हाल ही में लगा है कि आप चीजों के बारे में निर्णय लेने में सक्षम हैं?"
  },
  {
    id: 5,
    text: "Have you recently felt constantly under strain?",
    textTamil: "சமீபத்தில் நீங்கள் தொடர்ந்து மன அழுத்தத்தில் இருப்பதாக உணர்கிறீர்களா?",
    textHindi: "क्या आप हाल ही में लगातार तनाव में महसूस कर रहे हैं?"
  },
  {
    id: 6,
    text: "Have you recently felt you couldn't overcome your difficulties?",
    textTamil: "சமீபத்தில் உங்கள் கஷ்டங்களை வென்று வர முடியாது என்று உணர்கிறீர்களா?",
    textHindi: "क्या आपको हाल ही में लगा है कि आप अपनी कठिनाइयों पर काबू नहीं पा सकते?"
  },
  {
    id: 7,
    text: "Have you recently been able to enjoy your normal day-to-day activities?",
    textTamil: "சமீபத்தில் உங்கள் வழக்கமான தினசரி நடவடிக்கைகளை அனுபவிக்க முடிகிறதா?",
    textHindi: "क्या आप हाल ही में अपनी सामान्य दैनिक गतिविधियों का आनंद ले पा रहे हैं?"
  },
  {
    id: 8,
    text: "Have you recently been able to face up to your problems?",
    textTamil: "சமீபத்தில் உங்கள் பிரச்சனைகளை எதிர்கொள்ள முடிகிறதா?",
    textHindi: "क्या आप हाल ही में अपनी समस्याओं का सामना करने में सक्षम हैं?"
  },
  {
    id: 9,
    text: "Have you recently been feeling unhappy and depressed?",
    textTamil: "சமீபத்தில் நீங்கள் மகிழ்ச்சியற்ற மற்றும் மனச்சோர்வு உணர்கிறீர்களா?",
    textHindi: "क्या आप हाल ही में दुखी और उदास महसूस कर रहे हैं?"
  },
  {
    id: 10,
    text: "Have you recently been losing confidence in yourself?",
    textTamil: "சமீபத்தில் உங்கள் மீதான நம்பிக்கையை இழந்து வருகிறீர்களா?",
    textHindi: "क्या आप हाल ही में अपने आप पर से भरोसा खो रहे हैं?"
  },
  {
    id: 11,
    text: "Have you recently been thinking of yourself as a worthless person?",
    textTamil: "சமீபத்தில் நீங்கள் உங்களை ஒரு மதிப்பற்ற நபராக நினைக்கிறீர்களா?",
    textHindi: "क्या आप हाल ही में अपने आप को एक निकम्मा व्यक्ति समझ रहे हैं?"
  },
  {
    id: 12,
    text: "Have you recently been feeling reasonably happy, all things considered?",
    textTamil: "சமீபத்தில், எல்லாவற்றையும் கருத்தில் கொண்டு, நீங்கள் நியாயமான மகிழ்ச்சி உணர்கிறீர்களா?",
    textHindi: "क्या आप हाल ही में, सब कुछ को ध्यान में रखते हुए, उचित रूप से खुश महसूस कर रहे हैं?"
  }
];

// GHQ-12 uses different scoring: Better than usual (0), Same as usual (1), Worse than usual (2), Much worse than usual (3)
// For positive questions (1,3,4,7,8,12), scoring is reversed
const ANSWER_OPTIONS = [
  { value: 0, label: "Better than usual", labelTamil: "வழக்கத்தை விட சிறப்பாக", labelHindi: "सामान्य से बेहतर" },
  { value: 1, label: "Same as usual", labelTamil: "வழக்கம் போல", labelHindi: "सामान्य की तरह" },
  { value: 2, label: "Worse than usual", labelTamil: "வழக்கத்தை விட மோசமாக", labelHindi: "सामान्य से बुरा" },
  { value: 3, label: "Much worse than usual", labelTamil: "வழக்கத்தை விட மிகவும் மோசமாக", labelHindi: "सामान्य से बहुत बुरा" }
];

interface GHQ12ScreeningProps extends ScreeningProps {}

export default function GHQ12Screening({ 
  language = 'en', 
  onComplete,
  onCancel 
}: GHQ12ScreeningProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(12).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterThinking, setCharacterThinking] = useState(false);

  const getQuestionText = (question: Question) => {
    switch (language) {
      case 'ta': return question.textTamil || question.text;
      case 'hi': return question.textHindi || question.text;
      default: return question.text;
    }
  };

  const getOptionLabel = (option: any) => {
    switch (language) {
      case 'ta': return option.labelTamil;
      case 'hi': return option.labelHindi;
      default: return option.label;
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < 11) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const calculateScore = () => {
    // Positive questions (reverse scored): 1,3,4,7,8,12 (0-indexed: 0,2,3,6,7,11)
    const positiveQuestions = [0, 2, 3, 6, 7, 11];
    
    return answers.reduce((total, answer, index) => {
      if (positiveQuestions.includes(index)) {
        // Reverse score: 0->3, 1->2, 2->1, 3->0
        return total + (3 - answer);
      } else {
        return total + answer;
      }
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (score <= 15) {
      return {
        severity: 'Good',
        interpretation: 'Your responses suggest good psychological wellbeing. You appear to be coping well with life\'s challenges.',
        recommendations: [
          'Continue maintaining your current healthy lifestyle',
          'Keep up with activities that bring you joy and fulfillment',
          'Stay connected with supportive relationships',
          'Practice regular self-care activities',
          'Consider sharing your coping strategies with others'
        ]
      };
    } else if (score <= 20) {
      return {
        severity: 'Mild Distress',
        interpretation: 'Your responses suggest some psychological distress. This is common and manageable with appropriate support.',
        recommendations: [
          'Consider talking to friends, family, or a counselor',
          'Practice stress management techniques like deep breathing',
          'Maintain regular exercise and sleep schedule',
          'Limit alcohol and caffeine intake',
          'Engage in activities you enjoy',
          'Consider mindfulness or meditation practices'
        ]
      };
    } else if (score <= 25) {
      return {
        severity: 'Moderate Distress',
        interpretation: 'Your responses indicate moderate psychological distress that may benefit from professional support.',
        recommendations: [
          'Consider speaking with a mental health professional',
          'Reach out to trusted friends or family members',
          'Contact a mental health helpline for immediate support',
          'Practice regular relaxation techniques',
          'Maintain a routine and healthy lifestyle',
          'Avoid major life decisions until you feel more stable'
        ]
      };
    } else {
      return {
        severity: 'Significant Distress',
        interpretation: 'Your responses suggest significant psychological distress. Professional support is strongly recommended.',
        recommendations: [
          'Seek immediate professional mental health support',
          'Contact emergency helplines if you have thoughts of self-harm',
          'Reach out to trusted individuals in your support network',
          'Consider speaking with your primary care physician',
          'Avoid alcohol and drugs',
          'Stay connected with others and avoid isolation',
          'Consider joining a support group'
        ]
      };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCharacterThinking(true);
    
    const totalScore = calculateScore();
    const { severity, interpretation, recommendations } = getInterpretation(totalScore);
    
    const result: ScreeningResult = {
      totalScore,
      answers,
      interpretation,
      severity,
      recommendations,
      screeningType: 'GHQ-12'
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setCharacterThinking(false);
    onComplete(result);
  };

  const canSubmit = answers.every(answer => answer !== -1);
  const progress = ((currentQuestion + 1) / 12) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <AnimatedFace 
          expression="neutral" 
          thinking={characterThinking || isSubmitting}
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-2 mt-4">
          GHQ-12 General Health Assessment
        </h2>
        <p className="text-gray-600">
          Please think about how you have been feeling over the past few weeks
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of 12</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {getQuestionText(GHQ12_QUESTIONS[currentQuestion])}
            </h3>

            <div className="space-y-3">
              {ANSWER_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{getOptionLabel(option)}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion] === option.value
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentQuestion < 11 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[currentQuestion] === -1}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Complete Assessment'
            )}
          </button>
        )}
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center mt-6">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel Assessment
          </button>
        </div>
      )}
    </div>
  );
}