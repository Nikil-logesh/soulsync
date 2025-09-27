"use client";

import { useState } from 'react';
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
    color: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    hoverColor: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
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
    color: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    hoverColor: 'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
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
    color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    hoverColor: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
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
    window.location.href = `/resources?severity=${results?.severity}&type=${results?.screeningType}`;
  };

  // Show screening component if one is selected
  if (selectedScreening && !showResults) {
    const language = 'en';
    
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
      return (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px'
          }}>
            Screening Not Found
          </h1>
          <p style={{
            color: '#4a5568',
            marginBottom: '32px',
            fontSize: '16px'
          }}>
            The requested screening assessment is not available.
          </p>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '42px', 
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Mental Health Screening Hub
          </h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Choose from validated mental health assessment tools
          </p>
          <p style={{ 
            fontSize: '16px', 
            opacity: 0.8,
            fontWeight: '300',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            These scientifically validated screening tools help identify symptoms and provide personalized recommendations. All assessments are confidential and designed to support your mental wellness journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '-40px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* User Status Card */}
        {user ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            padding: '24px',
            marginBottom: '40px',
            border: '1px solid #dbeafe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                fontSize: '18px',
                fontWeight: '700',
                color: 'white'
              }}>
                {user.email?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div>
                <p style={{
                  fontWeight: '600',
                  color: '#1a202c',
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  Welcome back, {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#4a5568'
                }}>
                  Your results will be saved securely for progress tracking
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fefce8',
            borderRadius: '16px',
            border: '1px solid #fde68a',
            padding: '24px',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '24px', 
                marginRight: '12px' 
              }}>⚠️</span>
              <div>
                <p style={{
                  fontWeight: '600',
                  color: '#92400e',
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  Guest Mode
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#a16207'
                }}>
                  Sign in to save your results and track progress over time
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Screening Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>
          {screeningOptions.map((screening) => (
            <div
              key={screening.id}
              onClick={() => handleScreeningSelect(screening.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
              }}
            >
              {/* Card Header */}
              <div style={{
                background: screening.color,
                padding: '32px 24px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  lineHeight: '1'
                }}>
                  {screening.icon}
                </div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  margin: 0
                }}>
                  {screening.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  opacity: 0.9,
                  fontWeight: '300',
                  margin: 0
                }}>
                  {screening.fullName}
                </p>
              </div>

              {/* Card Content */}
              <div style={{ padding: '32px 24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {screening.category}
                  </span>
                </div>

                <p style={{
                  color: '#4a5568',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  fontSize: '14px'
                }}>
                  {screening.description}
                </p>

                {/* Quick Info */}
                <div style={{ 
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <span style={{ marginRight: '8px' }}>📝</span>
                    <span>{screening.questions} questions</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <span style={{ marginRight: '8px' }}>⏱️</span>
                    <span>{screening.duration}</span>
                  </div>
                </div>

                {/* Start Button */}
                <button 
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: screening.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = screening.hoverColor;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = screening.color;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '60px 40px',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Important Information
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🔒</span>
                Privacy & Confidentiality
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#4a5568',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}>• All responses are kept strictly confidential</li>
                <li style={{ marginBottom: '8px' }}>• No personally identifiable information is shared</li>
                <li style={{ marginBottom: '8px' }}>• Results are used only for your personal wellness journey</li>
                <li>• You can delete your data at any time</li>
              </ul>
            </div>

            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>📋</span>
                How These Tools Work
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#4a5568',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}>• Scientifically validated questionnaires</li>
                <li style={{ marginBottom: '8px' }}>• Used by healthcare professionals worldwide</li>
                <li style={{ marginBottom: '8px' }}>• Provide screening, not diagnosis</li>
                <li>• Results include personalized recommendations</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#1e40af',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0
            }}>
              <strong>Disclaimer:</strong> These screening tools are for educational and informational purposes only. 
              They do not replace professional medical diagnosis or treatment. If you're experiencing severe symptoms 
              or thoughts of self-harm, please seek immediate professional help.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d3748',
        color: '#e2e8f0',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            opacity: 0.8
          }}>
            © 2024 SoulSync Mental Wellness Platform. All rights reserved. | 
            Your mental health matters - we're here to support you.
          </p>
        </div>
      </footer>
    </div>
  );
}