"use client";

import { useState, useEffect } from 'react';
import { useSafeAuth } from '../../contexts/useSafeAuth';

interface ScreeningHistory {
  id: string;
  screeningType: string;
  totalScore: number;
  severity: string;
  interpretation: string;
  completedAt: string;
  nextTestRecommended: string;
  canRetakeNow: boolean;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useSafeAuth();
  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchScreeningHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchScreeningHistory = async () => {
    try {
      setLoading(true);
      
      // Get screening history from localStorage instead of API
      const storedResults = localStorage.getItem('soulsync_screening_results');
      if (storedResults) {
        const allResults = JSON.parse(storedResults);
        const userResults = allResults.filter((result: any) => result.userEmail === user?.email);
        setScreeningHistory(userResults);
      } else {
        setScreeningHistory([]);
      }
    } catch (error) {
      console.error('Error fetching screening history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#4a5568', fontSize: '16px' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px'
          }}>
            Sign In Required
          </h1>
          <p style={{
            color: '#4a5568',
            marginBottom: '32px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Please sign in to view your mental health profile and screening history.
          </p>
          <a 
            href="/signin"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

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
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            👤
          </div>
          
          <h1 style={{ 
            margin: 0, 
            fontSize: '42px', 
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Your Mental Health Profile
          </h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.5'
          }}>
            Track your wellness journey and progress over time
          </p>
          
          {/* User Info */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '12px 20px',
            borderRadius: '20px',
            marginTop: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                margin: 0,
                opacity: 0.9
              }}>
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </p>
              <p style={{ 
                fontSize: '12px',
                margin: 0,
                opacity: 0.7
              }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1000px', 
        margin: '-40px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Screening History Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '12px' }}>📊</span>
            Screening History
          </h2>
          
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>Loading your screening history...</p>
            </div>
          ) : screeningHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '12px'
              }}>
                No Screenings Yet
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '32px',
                fontSize: '16px',
                lineHeight: '1.6',
                maxWidth: '400px',
                margin: '0 auto 32px'
              }}>
                Take your first mental health assessment to start tracking your wellness journey.
              </p>
              <a 
                href="/screening"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Take First Screening
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {screeningHistory.map((screening) => (
                <div
                  key={screening.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'box-shadow 0.3s ease',
                    backgroundColor: '#fafafa'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '8px'
                      }}>
                        {screening.screeningType}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#4a5568'
                      }}>
                        {new Date(screening.completedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1a202c',
                        marginBottom: '8px'
                      }}>
                        {screening.totalScore}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: '500'
                      }}>
                        {screening.severity}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#4a5568',
                    marginBottom: '16px',
                    lineHeight: '1.6'
                  }}>
                    {screening.interpretation}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#718096'
                  }}>
                    <span>
                      Next test recommended: {new Date(screening.nextTestRecommended).toLocaleDateString()}
                    </span>
                    {screening.canRetakeNow && (
                      <a 
                        href="/screening"
                        style={{
                          color: '#667eea',
                          textDecoration: 'none',
                          fontWeight: '500',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#5a67d8'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
                      >
                        Retake Now →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/screening"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📋 Take New Screening
            </a>
            <a 
              href="/helplines"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🚨 Emergency Support
            </a>
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
            Your mental health journey is important to us.
          </p>
        </div>
      </footer>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}