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
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          GAD-7 Anxiety Screening
        </h1>
        <p className="text-gray-600">
          Generalized Anxiety Disorder - 7 items
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This questionnaire helps assess anxiety symptoms over the past 2 weeks
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of 7</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full"
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {getQuestionText(GAD7_QUESTIONS[currentQuestion])}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                  answers[currentQuestion] === option.value
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {getOptionText(option)}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    answers[currentQuestion] === option.value
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full m-0.5"
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
      <div className="flex justify-between items-center">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentQuestion
                  ? 'bg-green-500'
                  : i === currentQuestion
                  ? 'bg-teal-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-red-300 rounded-lg text-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Disclaimer:</strong> This screening tool is for informational purposes only and does not replace professional medical diagnosis. If you're experiencing severe anxiety symptoms, please seek professional mental health support.
        </p>
      </div>
    </div>
  );
}