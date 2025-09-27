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
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '36px' }}>SoulSync</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>
          Mental Wellness Platform
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderBottom: '1px solid #ddd',
        textAlign: 'center'
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4169e1',
            textDecoration: 'underline'
          }}
        >
          Home
        </button>
        <button
          onClick={() => router.push('/about')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4169e1',
            textDecoration: 'underline'
          }}
        >
          About
        </button>
        <button
          onClick={() => router.push('/contact')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4169e1',
            textDecoration: 'underline'
          }}
        >
          Contact
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
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
            <h3 style={{ color: '#4169e1', marginBottom: '15px' }}>
              {isAuthenticated ? "My Dashboard" : "Get Started"}
            </h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              {isAuthenticated 
                ? "Access your personal dashboard with wellness tools and resources."
                : "Create an account to access personalized wellness tools and screenings."
              }
            </p>
            <button style={{
              backgroundColor: '#4169e1',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '16px'
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
            <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
              AI Mental Health Support
            </h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              {isAuthenticated 
                ? "Chat with our AI for coping strategies and mindfulness exercises."
                : "Access AI-powered mental health support and personalized guidance."
              }
            </p>
            <button style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              {isAuthenticated ? "Start Chat" : "Sign In to Chat"}
            </button>
          </div>
        </div>
      </main>

      {/* Campus Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="w-full max-w-4xl mt-12 bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🏫 College Administrator?</h3>
          <p className="text-gray-700 mb-6">
            Bring SoulSync to your campus! Provide mental wellness support to your students with our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-600">✓</span>
              <span>Up to 10 students initially</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-600">✓</span>
              <span>Admin dashboard</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-600">✓</span>
              <span>24/7 crisis support</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/integrate-campus')}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition duration-300 shadow-lg"
          >
            Request Campus Integration
          </button>
        </div>
      </motion.div>

      {/* Floating Background Blobs */}
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-purple-200 opacity-20 rounded-full top-20 left-10 blur-3xl -z-10"
      />
      <motion.div
        animate={{ x: [0, -20, 20, 0], y: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-96 h-96 bg-green-200 opacity-20 rounded-full bottom-10 right-10 blur-3xl -z-10"
      />
    </div>
  );
}


