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
    <div style={{
      maxWidth: '672px',
      margin: '0 auto',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <AnimatedFace 
          expression="neutral" 
          thinking={characterThinking || isSubmitting}
        />
        <h2 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px',
          marginTop: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          GHQ-12 General Health Assessment
        </h2>
        <p style={{
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px'
        }}>
          Please think about how you have been feeling over the past few weeks
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <span>Question {currentQuestion + 1} of 12</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          height: '8px'
        }}>
          <motion.div
            style={{
              background: 'linear-gradient(to right, #22c55e, #3b82f6)',
              height: '8px',
              borderRadius: '9999px'
            }}
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
          style={{ marginBottom: '32px' }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {getQuestionText(GHQ12_QUESTIONS[currentQuestion])}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ANSWER_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    border: answers[currentQuestion] === option.value 
                      ? '2px solid #22c55e' 
                      : '2px solid #e5e7eb',
                    backgroundColor: answers[currentQuestion] === option.value 
                      ? '#f0fdf4' 
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={(e) => {
                    if (answers[currentQuestion] !== option.value) {
                      e.currentTarget.style.borderColor = '#86efac';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[currentQuestion] !== option.value) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#1f2937', fontSize: '16px' }}>{getOptionLabel(option)}</span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: answers[currentQuestion] === option.value
                        ? '2px solid #22c55e'
                        : '2px solid #d1d5db',
                      backgroundColor: answers[currentQuestion] === option.value
                        ? '#22c55e'
                        : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {answers[currentQuestion] === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'white',
                            borderRadius: '50%'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          style={{
            padding: '8px 24px',
            color: '#6b7280',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentQuestion !== 0) {
              e.currentTarget.style.color = '#1f2937';
            }
          }}
          onMouseLeave={(e) => {
            if (currentQuestion !== 0) {
              e.currentTarget.style.color = '#6b7280';
            }
          }}
        >
          ← Previous
        </button>

        {currentQuestion < 11 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[currentQuestion] === -1}
            style={{
              padding: '12px 24px',
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: answers[currentQuestion] === -1 ? 'not-allowed' : 'pointer',
              opacity: answers[currentQuestion] === -1 ? 0.5 : 1,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (answers[currentQuestion] !== -1) {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }
            }}
            onMouseLeave={(e) => {
              if (answers[currentQuestion] !== -1) {
                e.currentTarget.style.backgroundColor = '#22c55e';
              }
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(to right, #22c55e, #3b82f6)',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: (!canSubmit || isSubmitting) ? 'not-allowed' : 'pointer',
              opacity: (!canSubmit || isSubmitting) ? 0.5 : 1,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (canSubmit && !isSubmitting) {
                e.currentTarget.style.background = 'linear-gradient(to right, #16a34a, #2563eb)';
              }
            }}
            onMouseLeave={(e) => {
              if (canSubmit && !isSubmitting) {
                e.currentTarget.style.background = 'linear-gradient(to right, #22c55e, #3b82f6)';
              }
            }}
          >
            {isSubmitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
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
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={onCancel}
            style={{
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            Cancel Assessment
          </button>
        </div>
      )}
    </div>
  );
}