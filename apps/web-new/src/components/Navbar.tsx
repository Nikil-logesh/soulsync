'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSafeAuth } from '../contexts/useSafeAuth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useSafeAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Don't show navbar on signin page
  if (pathname === '/signin') {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '16px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        {/* Logo/Brand */}
        <div 
          onClick={() => router.push('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            SS
          </div>
          <span style={{
            fontWeight: '700',
            fontSize: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
          }}>
            SoulSync
          </span>
        </div>

        {/* Navigation Links */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '32px'
        }}>
          <div style={{
            display: 'flex',
            gap: '24px'
          }}>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: pathname === '/' ? '#667eea' : '#4a5568',
                textDecoration: 'none',
                borderBottom: pathname === '/' ? '2px solid #667eea' : '2px solid transparent',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/') {
                  e.currentTarget.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/') {
                  e.currentTarget.style.color = '#4a5568';
                }
              }}
            >
              Home
            </button>

            <button
              onClick={() => router.push('/about')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: pathname === '/about' ? '#667eea' : '#4a5568',
                textDecoration: 'none',
                borderBottom: pathname === '/about' ? '2px solid #667eea' : '2px solid transparent',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/about') {
                  e.currentTarget.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/about') {
                  e.currentTarget.style.color = '#4a5568';
                }
              }}
            >
              About
            </button>

            <button
              onClick={() => router.push('/contact')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: pathname === '/contact' ? '#667eea' : '#4a5568',
                textDecoration: 'none',
                borderBottom: pathname === '/contact' ? '2px solid #667eea' : '2px solid transparent',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/contact') {
                  e.currentTarget.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/contact') {
                  e.currentTarget.style.color = '#4a5568';
                }
              }}
            >
              Contact
            </button>

            {user && (
              <button
                onClick={() => router.push('/prompt')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: pathname === '/prompt' ? '#10b981' : '#4a5568',
                  textDecoration: 'none',
                  borderBottom: pathname === '/prompt' ? '2px solid #10b981' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== '/prompt') {
                    e.currentTarget.style.color = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/prompt') {
                    e.currentTarget.style.color = '#4a5568';
                  }
                }}
              >
                AI Chat
              </button>
            )}

            {user && (
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: pathname === '/dashboard' ? '#667eea' : '#4a5568',
                  textDecoration: 'none',
                  borderBottom: pathname === '/dashboard' ? '2px solid #667eea' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== '/dashboard') {
                    e.currentTarget.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/dashboard') {
                    e.currentTarget.style.color = '#4a5568';
                  }
                }}
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Auth Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {loading ? (
              <div style={{
                padding: '8px 16px',
                color: '#9ca3af',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Loading...
              </div>
            ) : user ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={{ 
                    color: '#2d3748', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    backgroundColor: '#f56565',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f56565'}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/signin')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}