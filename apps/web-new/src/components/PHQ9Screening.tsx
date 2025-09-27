"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreeningResult, Question, ScreeningOption, ScreeningProps } from '@/types/screening';

const PHQ9_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things",
    textTamil: "எதிலும் ஆர்வம் அல்லது மகிழ்ச்சி இல்லாமை",
    textHindi: "किसी भी काम में रुचि या खुशी नहीं लगना"
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless",
    textTamil: "மனச்சோர்வு, அல்லது நம்பிக்கையின்மை உணர்வு",
    textHindi: "उदास, अवसाद या निराशा महसूस करना"
  },
  {
    id: 3,
    text: "Trouble falling or staying asleep, or sleeping too much",
    textTamil: "தூக்கமின்மை அல்லது அதிக தூக்கம்",
    textHindi: "नींद न आना, नींद में बने रहने में परेशानी या बहुत ज्यादा सोना"
  },
  {
    id: 4,
    text: "Feeling tired or having little energy",
    textTamil: "சோர்வு அல்லது ஆற்றலின்மை",
    textHindi: "थकान महसूस करना या ऊर्जा की कमी"
  },
  {
    id: 5,
    text: "Poor appetite or overeating",
    textTamil: "பசியின்மை அல்லது அதிக உணவு உண்ணுதல்",
    textHindi: "भूख न लगना या बहुत ज्यादा खाना"
  },
  {
    id: 6,
    text: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    textTamil: "தன்னைப் பற்றிய தவறான உணர்வு அல்லது குடும்பத்தை ஏமாற்றிய உணர்வு",
    textHindi: "अपने बारे में बुरा महसूस करना या यह लगना कि आप असफल हैं या अपने परिवार को निराश किया है"
  },
  {
    id: 7,
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    textTamil: "கவனம் செலுத்துவதில் சிரமம், படித்தல் அல்லது டி.வி பார்த்தல்",
    textHindi: "अखबार पढ़ने या टीवी देखने जैसी चीजों पर ध्यान केंद्रित करने में परेशानी"
  },
  {
    id: 8,
    text: "Moving or speaking so slowly that other people could have noticed. Or being so fidgety or restless that you have been moving around a lot more than usual",
    textTamil: "மெதுவாக பேசுதல் அல்லது நடவடிக்கை அல்லது அதிக அமைதியின்மை",
    textHindi: "इतनी धीरे-धीरे चलना या बोलना कि दूसरे लोग नोटिस कर सकें या इतनी बेचैनी कि सामान्य से ज्यादा हिलते-डुलते रहना"
  },
  {
    id: 9,
    text: "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
    textTamil: "தன்னைத் தீங்கு செய்து கொள்ளும் எண்ணங்கள்",
    textHindi: "यह सोचना कि आप मर जाएं तो बेहतर होगा या किसी तरह से खुद को नुकसान पहुंचाने के विचार"
  }
];

const OPTIONS: ScreeningOption[] = [
  { value: 0, label: "Not at all", tamil: "இல்லவே இல்லை", hindi: "बिल्कुल नहीं" },
  { value: 1, label: "Several days", tamil: "சில நாட்கள்", hindi: "कई दिन" },
  { value: 2, label: "More than half the days", tamil: "பாதி நாட்களுக்கும் மேல்", hindi: "आधे से ज्यादा दिन" },
  { value: 3, label: "Nearly every day", tamil: "ஏறக்குறைய தினமும்", hindi: "लगभग हर दिन" }
];

interface PHQ9ScreeningProps extends ScreeningProps {}

export default function PHQ9Screening({ language = 'en', onComplete, onCancel }: PHQ9ScreeningProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [showResults, setShowResults] = useState(false);

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

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < 8) {
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
      interpretation = "Minimal depression symptoms";
      recommendations = [
        "Continue maintaining your current mental wellness practices",
        "Consider regular exercise and healthy sleep habits",
        "Practice mindfulness and stress management techniques"
      ];
    } else if (totalScore <= 9) {
      severity = "mild";
      interpretation = "Mild depression symptoms";
      recommendations = [
        "Consider speaking with a counselor or therapist",
        "Engage in regular physical activity and social connections",
        "Practice relaxation techniques and stress management",
        "Monitor your symptoms and seek help if they worsen"
      ];
    } else if (totalScore <= 14) {
      severity = "moderate";
      interpretation = "Moderate depression symptoms";
      recommendations = [
        "Strongly consider professional mental health support",
        "Engage in therapy or counseling services",
        "Consider medication evaluation with a healthcare provider",
        "Build a strong support network with family and friends"
      ];
    } else if (totalScore <= 19) {
      severity = "moderately_severe";
      interpretation = "Moderately severe depression symptoms";
      recommendations = [
        "Seek professional mental health treatment immediately",
        "Consider both therapy and medication evaluation",
        "Inform trusted family members or friends about your condition",
        "Create a safety plan and crisis support contacts"
      ];
    } else {
      severity = "severe";
      interpretation = "Severe depression symptoms";
      recommendations = [
        "Seek immediate professional mental health treatment",
        "Consider urgent psychiatric evaluation",
        "Inform immediate family/support system",
        "Create immediate safety plan",
        "Contact crisis helplines if needed"
      ];
    }

    const result: ScreeningResult = {
      totalScore,
      answers: finalAnswers,
      interpretation,
      severity,
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / 9) * 100;

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
          PHQ-9 Depression Screening
        </h1>
        <p style={{
          color: '#4b5563',
          margin: 0
        }}>
          Patient Health Questionnaire - 9 items
        </p>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          This questionnaire helps assess depression symptoms over the past 2 weeks
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
          <span>Question {currentQuestion + 1} of 9</span>
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
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
              {getQuestionText(PHQ9_QUESTIONS[currentQuestion])}
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
                  border: answers[currentQuestion] === option.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: answers[currentQuestion] === option.value ? '#eff6ff' : 'transparent',
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
                    border: answers[currentQuestion] === option.value ? '2px solid #3b82f6' : '2px solid #d1d5db',
                    backgroundColor: answers[currentQuestion] === option.value ? '#3b82f6' : 'white',
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: '12px 24px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            backgroundColor: 'transparent',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s ease'
          }}
        >
          ← Previous
        </button>

        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: i < currentQuestion ? '#22c55e' : i === currentQuestion ? '#3b82f6' : '#d1d5db'
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
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
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
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '8px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#92400e',
          margin: 0
        }}>
          <strong>Disclaimer:</strong> This screening tool is for informational purposes only and does not replace professional medical diagnosis. If you're experiencing severe symptoms or having thoughts of self-harm, please seek immediate professional help.
        </p>
      </div>
    </div>
  );
}