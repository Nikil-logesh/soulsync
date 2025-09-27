'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSafeAuth } from '../../contexts/useSafeAuth';

export default function SignInPage() {
  const router = useRouter();
  const { user, userRole, loading, signInWithSupabase } = useSafeAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  useEffect(() => {
    // Only redirect if we have both user and role to prevent incomplete redirects
    if (user && userRole && !loading) {
      // Role-based routing
      switch (userRole) {
        case 'developer':
          router.push('/developer-dashboard');
          break;
        case 'college_admin':
          router.push('/admin-dashboard');
          break;
        case 'student':
          router.push('/dashboard');
          break;
        default:
          router.push('/dashboard');
          break;
      }
    }
  }, [user, userRole, loading, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!signInWithSupabase || typeof signInWithSupabase !== 'function') {
        throw new Error('Authentication function not available');
      }
      
      await signInWithSupabase(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (type: 'developer' | 'admin' | 'student') => {
    switch (type) {
      case 'developer':
        setEmail('developer@soulsync.com');
        setPassword('dev123');
        break;
      case 'admin':
        setEmail('admin@college.edu');
        setPassword('welcome@123');
        break;
      case 'student':
        setEmail('student@college.edu');
        setPassword('welcome@123');
        break;
    }
    setShowDemoCredentials(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '128px',
          height: '128px',
          border: '2px solid transparent',
          borderBottom: '2px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '448px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>SoulSync</h1>
          <p style={{
            color: '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px'
          }}>Your Mental Wellness Companion</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>Sign In</h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px'
          }}>
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              outline: 'none',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            required
            disabled={isSubmitting}
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              outline: 'none',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            required
            disabled={isSubmitting}
          />
          
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '500',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.5 : 1,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            style={{
              width: '100%',
              fontSize: '14px',
              color: '#6b7280',
              padding: '8px 0',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white',
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
            {showDemoCredentials ? 'Hide' : 'Show'} Demo Credentials
          </button>
          
          {showDemoCredentials && (
            <div style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px',
                marginBottom: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>Demo Accounts:</h3>
              
              <button
                onClick={() => fillDemoCredentials('developer')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px',
                  fontSize: '14px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '4px',
                  border: '1px solid #bfdbfe',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                }}
              >
                <div style={{ fontWeight: '500' }}>Developer Account</div>
                <div style={{ color: '#6b7280' }}>developer@soulsync.com / dev123</div>
              </button>
              
              <button
                onClick={() => fillDemoCredentials('admin')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px',
                  fontSize: '14px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bbf7d0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dcfce7';
                }}
              >
                <div style={{ fontWeight: '500' }}>College Admin Account</div>
                <div style={{ color: '#6b7280' }}>admin@college.edu / welcome@123</div>
              </button>
              
              <button
                onClick={() => fillDemoCredentials('student')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '4px',
                  border: '1px solid #e9d5ff',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9d5ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3e8ff';
                }}
              >
                <div style={{ fontWeight: '500' }}>Student Account</div>
                <div style={{ color: '#6b7280' }}>student@college.edu / welcome@123</div>
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              fontSize: '14px',
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
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
            ← Back to Home
          </button>
        </div>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/integrate-campus')}
            style={{
              fontSize: '14px',
              color: '#2563eb',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textDecoration: 'none',
              transition: 'text-decoration 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            New College? Request Integration
          </button>
        </div>
      </div>
    </div>
  );
}