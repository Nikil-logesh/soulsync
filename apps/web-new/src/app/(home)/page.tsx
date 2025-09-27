"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSafeAuth } from '../../contexts/useSafeAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSafeAuth();
  
  const isGuest = !user;
  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen wellness-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-6" 
                 style={{ borderColor: 'var(--sage-200)', borderTopColor: 'transparent' }}></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-t-transparent animate-ping opacity-20 mx-auto"
                 style={{ borderColor: 'var(--sage-400)', borderTopColor: 'transparent' }}></div>
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--sage-600)' }}>MindfulCare</h2>
          <p style={{ color: 'var(--foreground-secondary)' }}>Loading your wellness companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: 'var(--sage-600)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>
              MindfulCare
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-sm font-medium hover:opacity-70 transition-opacity"
               style={{ color: 'var(--foreground-secondary)' }}>About</a>
            <a href="/resources" className="text-sm font-medium hover:opacity-70 transition-opacity"
               style={{ color: 'var(--foreground-secondary)' }}>Resources</a>
            <a href="/contact" className="text-sm font-medium hover:opacity-70 transition-opacity"
               style={{ color: 'var(--foreground-secondary)' }}>Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                  style={{ 
                    color: 'var(--sage-600)',
                    backgroundColor: 'var(--sage-100)' 
                  }}
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push("/signin")}
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push("/guest-chat")}
                  className="btn btn-primary text-sm px-4 py-2 text-white font-medium"
                >
                  Try Free Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 pt-32 relative overflow-hidden wellness-gradient">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
              style={{ color: 'var(--foreground)' }}>
            Your Mental Wellness
            <span className="block mt-2" style={{ color: 'var(--sage-600)' }}>
              Journey Starts Here
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 leading-relaxed font-light"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            Connect with our culturally-aware AI companion for personalized support, 
            coping strategies, and professional guidance tailored to your unique background.
          </motion.p>
        </motion.div>

        {/* Main Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <button 
            onClick={() => router.push(isAuthenticated ? "/prompt" : "/guest-chat")}
            className="btn btn-primary text-lg px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ fontSize: '1.125rem' }}
          >
            {isAuthenticated ? "Continue Your Journey" : "Start Chatting - No Sign Up Required"}
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        >
          {/* Personal Dashboard Card */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="card wellness-card p-8 cursor-pointer group relative overflow-hidden"
            onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
          >
            {isGuest && (
              <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium"
                   style={{ 
                     backgroundColor: 'var(--lavender-100)', 
                     color: 'var(--lavender-500)' 
                   }}>
                Sign In Required
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                   style={{ backgroundColor: 'var(--sage-100)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--sage-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              {isAuthenticated ? "Your Dashboard" : "Personal Dashboard"}
            </h3>
            <p style={{ color: 'var(--foreground-secondary)' }}>
              {isAuthenticated 
                ? "Track your progress, access personalized insights, and manage your wellness journey."
                : "Get personalized insights, track your mental health journey, and access professional resources."
              }
            </p>
          </motion.div>

          {/* AI Companion Card */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="card wellness-card p-8 cursor-pointer group relative overflow-hidden"
            onClick={() => router.push(isAuthenticated ? "/prompt" : "/guest-chat")}
          >
            {isGuest && (
              <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium"
                   style={{ 
                     backgroundColor: 'var(--blue-100)', 
                     color: 'var(--blue-600)' 
                   }}>
                Available Now
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                   style={{ backgroundColor: 'var(--blue-100)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--blue-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              AI Wellness Companion
            </h3>
            <p style={{ color: 'var(--foreground-secondary)' }}>
              Chat with our culturally-aware AI for instant support, coping strategies, and personalized guidance available 24/7.
            </p>
          </motion.div>

          {/* Resources Card */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="card wellness-card p-8 cursor-pointer group relative overflow-hidden"
            onClick={() => router.push("/resources")}
          >          
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                   style={{ backgroundColor: 'var(--lavender-100)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--lavender-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              Wellness Resources
            </h3>
            <p style={{ color: 'var(--foreground-secondary)' }}>
              Access curated articles, exercises, and professional resources to support your mental health journey.
            </p>
          </motion.div>
        </motion.div>

        {/* Secondary Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mt-12"
        >
          {/* Screening Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="card wellness-card p-6 cursor-pointer"
            onClick={() => router.push(isAuthenticated ? "/screening" : "/signin")}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                   style={{ backgroundColor: 'var(--sage-100)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--sage-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Mental Health Screening</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
              Take confidential assessments to understand your mental health status and get personalized recommendations.
            </p>
          </motion.div>

          {/* Emergency Support Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="card wellness-card p-6 cursor-pointer"
            onClick={() => router.push("/emergency")}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                   style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Emergency Support</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
              Immediate access to crisis hotlines, emergency contacts, and urgent mental health resources.
            </p>
          </motion.div>
        </motion.div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5" 
               style={{ backgroundColor: 'var(--sage-300)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5" 
               style={{ backgroundColor: 'var(--blue-300)' }}></div>
        </div>
      </div>
    </div>
  );
}