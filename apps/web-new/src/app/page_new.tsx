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
        backgroundColor: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>SoulSync</h2>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Simple Header */}
      <header style={{
        backgroundColor: '#4169e1',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '36px' }}>SoulSync</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>
          Mental Wellness Platform
        </p>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '28px' }}>
          Welcome to SoulSync Mental Wellness
        </h2>
        <p style={{ 
          color: '#666', 
          fontSize: '18px', 
          lineHeight: '1.6', 
          maxWidth: '600px', 
          margin: '0 auto 40px auto' 
        }}>
          SoulSync is your digital mental wellbeing platform. Get tools to manage stress, 
          access mental health screenings, and receive professional support in a private environment.
        </p>

        {/* Simple Feature Boxes */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '20px',
          marginTop: '40px'
        }}>
          {/* Get Started Box */}
          <div style={{
            border: '2px solid #4169e1',
            padding: '30px',
            width: '300px',
            backgroundColor: '#f8f9ff',
            cursor: 'pointer'
          }}
          onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
          >
            <h3 style={{ color: '#4169e1', marginBottom: '15px', fontSize: '22px' }}>
              {isAuthenticated ? "My Dashboard" : "Get Started"}
            </h3>
            <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>
              {isAuthenticated 
                ? "Access your personal dashboard with wellness tools and resources."
                : "Create an account to access personalized wellness tools and screenings."
              }
            </p>
            <button style={{
              backgroundColor: '#4169e1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '4px'
            }}>
              {isAuthenticated ? "Go to Dashboard" : "Sign In"}
            </button>
          </div>

          {/* AI Support Box */}
          <div style={{
            border: '2px solid #28a745',
            padding: '30px',
            width: '300px',
            backgroundColor: '#f8fff9',
            cursor: 'pointer'
          }}
          onClick={() => router.push(isAuthenticated ? "/prompt" : "/signin")}
          >
            <h3 style={{ color: '#28a745', marginBottom: '15px', fontSize: '22px' }}>
              AI Mental Health Support
            </h3>
            <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>
              {isAuthenticated 
                ? "Chat with our AI for coping strategies and mindfulness exercises."
                : "Access AI-powered mental health support and personalized guidance."
              }
            </p>
            <button style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '4px'
            }}>
              {isAuthenticated ? "Start Chat" : "Sign In to Chat"}
            </button>
          </div>
        </div>

        {/* Additional Info Section */}
        <div style={{ 
          marginTop: '60px',
          padding: '40px 20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>
            Why Choose SoulSync?
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div style={{ maxWidth: '200px', textAlign: 'center' }}>
              <h4 style={{ color: '#4169e1', marginBottom: '10px' }}>Private & Secure</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Your mental health data is protected with enterprise-grade security.
              </p>
            </div>
            <div style={{ maxWidth: '200px', textAlign: 'center' }}>
              <h4 style={{ color: '#4169e1', marginBottom: '10px' }}>24/7 Available</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Access support and resources whenever you need them, day or night.
              </p>
            </div>
            <div style={{ maxWidth: '200px', textAlign: 'center' }}>
              <h4 style={{ color: '#4169e1', marginBottom: '10px' }}>Evidence-Based</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Our tools are based on proven mental health research and practices.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #ddd',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ color: '#666', margin: 0 }}>
          © 2024 SoulSync Mental Wellness Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}