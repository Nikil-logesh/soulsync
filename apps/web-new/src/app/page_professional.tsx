"use client";

import { useRouter } from "next/navigation";
import { useSafeAuth } from '../contexts/useSafeAuth';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSafeAuth();
  
  const isAuthenticated = !!user;

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ 
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '16px', fontSize: '24px', fontWeight: '600' }}>SoulSync</h2>
          <p style={{ color: '#666', margin: 0 }}>Loading your wellness platform...</p>
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
        padding: '80px 20px 100px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '48px', 
            fontWeight: '700',
            marginBottom: '20px',
            letterSpacing: '-0.5px'
          }}>SoulSync</h1>
          <p style={{ 
            fontSize: '22px', 
            opacity: 0.95,
            fontWeight: '300',
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            Your Complete Mental Wellness Platform
          </p>
          <p style={{ 
            fontSize: '16px', 
            opacity: 0.85,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Professional mental health support, AI-powered guidance, and comprehensive wellness tools in one secure, confidential platform designed for your wellbeing journey.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '-50px auto 0',
        padding: '0 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Welcome Section */}
          <div style={{ padding: '60px 40px 40px', textAlign: 'center' }}>
            <h2 style={{ 
              color: '#1a202c', 
              marginBottom: '20px', 
              fontSize: '32px',
              fontWeight: '600',
              lineHeight: '1.2'
            }}>
              Welcome to Your Wellness Journey
            </h2>
            <p style={{ 
              color: '#4a5568', 
              fontSize: '18px', 
              lineHeight: '1.6', 
              maxWidth: '700px', 
              margin: '0 auto 50px'
            }}>
              SoulSync provides comprehensive mental health support through AI-guided assistance, 
              professional counseling, wellness resources, and peer community - all designed 
              to support your mental wellbeing in a safe, confidential environment.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div style={{ 
            padding: '0 40px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Get Started Card */}
            <div 
              style={{
                background: isAuthenticated 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                padding: '32px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {isAuthenticated ? '📊' : '🚀'}
              </div>
              <h3 style={{ 
                marginBottom: '16px', 
                fontSize: '22px',
                fontWeight: '600'
              }}>
                {isAuthenticated ? "My Dashboard" : "Get Started"}
              </h3>
              <p style={{ 
                opacity: 0.9,
                lineHeight: '1.5', 
                marginBottom: '24px',
                fontSize: '16px'
              }}>
                {isAuthenticated 
                  ? "Access your personal wellness dashboard with progress tracking, resources, and personalized insights."
                  : "Begin your mental wellness journey with personalized assessments, resources, and professional support."
                }
              </p>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                display: 'inline-block'
              }}>
                {isAuthenticated ? "Open Dashboard →" : "Start Journey →"}
              </div>
            </div>

            {/* AI Support Card */}
            <div 
              style={{
                background: isAuthenticated 
                  ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                  : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                color: '#1a202c',
                padding: '32px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              onClick={() => router.push(isAuthenticated ? "/prompt" : "/signin")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ 
                marginBottom: '16px', 
                fontSize: '22px',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                AI Mental Health Support
              </h3>
              <p style={{ 
                color: '#4a5568',
                lineHeight: '1.5', 
                marginBottom: '24px',
                fontSize: '16px'
              }}>
                {isAuthenticated 
                  ? "Get instant support through our AI companion. Chat about your feelings, receive coping strategies, and practice mindfulness."
                  : "Experience our AI-powered mental health assistant that provides personalized guidance, coping strategies, and emotional support."
                }
              </p>
              <div style={{
                backgroundColor: '#2d3748',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                display: 'inline-block'
              }}>
                {isAuthenticated ? "Start Chatting →" : "Try AI Support →"}
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div style={{ 
            padding: '60px 40px',
            backgroundColor: '#f7fafc',
            borderTop: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              textAlign: 'center',
              color: '#2d3748', 
              marginBottom: '40px', 
              fontSize: '28px',
              fontWeight: '600'
            }}>
              Why Choose SoulSync?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '40px', 
                  marginBottom: '16px'
                }}>🔒</div>
                <h4 style={{ 
                  color: '#2d3748', 
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>Private & Secure</h4>
                <p style={{ 
                  color: '#4a5568', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Your mental health data is protected with enterprise-grade security and complete confidentiality.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '40px', 
                  marginBottom: '16px'
                }}>🌍</div>
                <h4 style={{ 
                  color: '#2d3748', 
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>24/7 Available</h4>
                <p style={{ 
                  color: '#4a5568', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Access mental health support and wellness resources whenever you need them, from anywhere.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '40px', 
                  marginBottom: '16px'
                }}>🧠</div>
                <h4 style={{ 
                  color: '#2d3748', 
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>Evidence-Based</h4>
                <p style={{ 
                  color: '#4a5568', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Our tools and resources are grounded in proven mental health research and clinical practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d3748',
        color: '#e2e8f0',
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            opacity: 0.8
          }}>
            © 2024 SoulSync Mental Wellness Platform. All rights reserved. | 
            Committed to your mental health and wellbeing.
          </p>
        </div>
      </footer>
    </div>
  );
}