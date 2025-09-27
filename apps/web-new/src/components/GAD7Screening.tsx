"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreeningResult, Question, ScreeningOption, ScreeningProps } from '@/types/screening';

const GAD7_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Feeling nervous, anxious, or on edge",
    textTamil: "பதட்டம், கவலை அல்லது எரிச்சல் உணர்வு",
    textHindi: "घबराहट, चिंता या बेचैनी महसूस करना"
  },
  {
    id: 2,
    text: "Not being able to stop or control worrying",
    textTamil: "கவலையை நிறுத்த அல்லது கட்டுப்படுத்த முடியாமை",
    textHindi: "चिंता को रोकने या नियंत्रित करने में असमर्थता"
  },
  {
    id: 3,
    text: "Worrying too much about different things",
    textTamil: "பல்வேறு விஷயங்களில் அதிக கவலை",
    textHindi: "अलग-अलग चीजों के बारे में बहुत ज्यादा चिंता करना"
  },
  {
    id: 4,
    text: "Trouble relaxing",
    textTamil: "ஓய்வெடுப்பதில் சிரमம்",
    textHindi: "आराम करने में परेशानी"
  },
  {
    id: 5,
    text: "Being so restless that it's hard to sit still",
    textTamil: "அமைதியாக உட்கார முடியாத அளவிற்கு அமைதியின்மை",
    textHindi: "इतनी बेचैनी कि एक जगह बैठना मुश्किल हो"
  },
  {
    id: 6,
    text: "Becoming easily annoyed or irritable",
    textTamil: "எளிதில் எரிச்சல் அல்லது கோபம் வருதல்",
    textHindi: "आसानी से परेशान या चिड़चिड़ाहट होना"
  },
  {
    id: 7,
    text: "Feeling afraid as if something awful might happen",
    textTamil: "ஏதேனும் கெட்ட விஷயம் நடக்கும் என்ற பயம்",
    textHindi: "डर लगना जैसे कि कुछ भयानक होने वाला है"
  }
];

const OPTIONS = [
  { value: 0, label: "Not at all", tamil: "இல்லவே இல்லை", hindi: "बिल्कुल नहीं" },
  { value: 1, label: "Several days", tamil: "சில நாட்கள்", hindi: "कई दिन" },
  { value: 2, label: "More than half the days", tamil: "பாதி நாட்களுக்கும் மேல்", hindi: "आधे से ज्यादा दिन" },
  { value: 3, label: "Nearly every day", tamil: "ஏறக்குறைய தினமும்", hindi: "लगभग हर दिन" }
];

interface GAD7ScreeningProps extends ScreeningProps {}

export default function GAD7Screening({ language = 'en', onComplete, onCancel }: GAD7ScreeningProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(7).fill(-1));

  const getQuestionText = (question: Question) => {
    switch (language) {
      case 'ta': return question.textTamil || question.text;
      case 'hi': return question.textHindi || question.text;
      default: return question.text;
    }
  };

  const getOptionText = (option: typeof OPTIONS[0]) => {
    switch (language) {
      case 'ta': return option.tamil;
      case 'hi': return option.hindi;
      default: return option.label;
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < 6) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 300);
  };

  const calculateResults = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((sum, answer) => sum + answer, 0);
    
    let interpretation = "";
    let severity = "";
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      severity = "minimal";
      interpretation = "Minimal anxiety symptoms";
      recommendations = [
        "Continue current stress management practices",
        "Maintain regular exercise and healthy sleep habits",
        "Practice relaxation techniques like deep breathing",
        "Consider mindfulness or meditation practices"
      ];
    } else if (totalScore <= 9) {
      severity = "mild";
      interpretation = "Mild anxiety symptoms";
      recommendations = [
        "Learn anxiety management techniques",
        "Consider counseling or therapy",
        "Practice regular relaxation exercises",
        "Identify and avoid anxiety triggers when possible",
        "Maintain social connections and support systems"
      ];
    } else if (totalScore <= 14) {
      severity = "moderate";
      interpretation = "Moderate anxiety symptoms";
      recommendations = [
        "Seek professional mental health support",
        "Consider cognitive behavioral therapy (CBT)",
        "Learn coping strategies for anxiety management",
        "Discuss treatment options with a healthcare provider",
        "Build a strong support network"
      ];
    } else {
      severity = "severe";
      interpretation = "Severe anxiety symptoms";
      recommendations = [
        "Seek immediate professional mental health treatment",
        "Consider both therapy and medication evaluation",
        "Develop a comprehensive anxiety management plan",
        "Inform trusted family members or support system",
        "Create coping strategies for panic or severe anxiety episodes"
      ];
    }

    const result: ScreeningResult = {
      totalScore,
      answers: finalAnswers,
      interpretation,
      severity,
      recommendations
    };

    onComplete(result);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / 7) * 100;

  return (
    <div style={{
      maxWidth: '512px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          GAD-7 Anxiety Screening
        </h1>
        <p style={{
          color: '#4b5563',
          margin: 0
        }}>
          Generalized Anxiety Disorder - 7 items
        </p>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          This questionnaire helps assess anxiety symptoms over the past 2 weeks
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#4b5563',
          marginBottom: '8px'
        }}>
          <span>Question {currentQuestion + 1} of 7</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: '#e5e7eb',
          borderRadius: '20px',
          height: '12px'
        }}>
          <motion.div
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
              height: '12px',
              borderRadius: '20px'
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '32px',
            marginBottom: '24px'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {getQuestionText(GAD7_QUESTIONS[currentQuestion])}
            </p>
          </div>

          {/* Answer Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  textAlign: 'left',
                  border: answers[currentQuestion] === option.value ? '2px solid #22c55e' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: answers[currentQuestion] === option.value ? '#f0fdf4' : 'transparent',
                  boxShadow: answers[currentQuestion] === option.value ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>
                    {getOptionText(option)}
                  </span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: answers[currentQuestion] === option.value ? '2px solid #22c55e' : '2px solid #d1d5db',
                    backgroundColor: answers[currentQuestion] === option.value ? '#22c55e' : 'white',
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
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: '12px 24px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentQuestion !== 0) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentQuestion !== 0) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor:
                  i < currentQuestion
                    ? '#22c55e'
                    : i === currentQuestion
                    ? '#14b8a6'
                    : '#d1d5db'
              }}
            />
          ))}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#dc2626',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#1e40af',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: '1.5',
          margin: 0
        }}>
          <strong>Disclaimer:</strong> This screening tool is for informational purposes only and does not replace professional medical diagnosis. If you're experiencing severe anxiety symptoms, please seek professional mental health support.
        </p>
      </div>
    </div>
  );
}