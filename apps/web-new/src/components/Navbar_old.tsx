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
      backgroundColor: '#f8f9fa',
      padding: '15px 20px',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Brand */}
        <div 
          onClick={() => router.push('/')}
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#4169e1'
          }}
        >
          SoulSync
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: pathname === '/' ? '#333' : '#4169e1',
              textDecoration: pathname === '/' ? 'none' : 'underline',
              fontWeight: pathname === '/' ? 'bold' : 'normal'
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
              fontSize: '14px',
              color: pathname === '/about' ? '#333' : '#4169e1',
              textDecoration: pathname === '/about' ? 'none' : 'underline',
              fontWeight: pathname === '/about' ? 'bold' : 'normal'
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
              fontSize: '14px',
              color: pathname === '/contact' ? '#333' : '#4169e1',
              textDecoration: pathname === '/contact' ? 'none' : 'underline',
              fontWeight: pathname === '/contact' ? 'bold' : 'normal'
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
                fontSize: '14px',
                color: pathname === '/prompt' ? '#333' : '#28a745',
                textDecoration: pathname === '/prompt' ? 'none' : 'underline',
                fontWeight: pathname === '/prompt' ? 'bold' : 'normal'
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
                fontSize: '14px',
                color: pathname === '/dashboard' ? '#333' : '#4169e1',
                textDecoration: pathname === '/dashboard' ? 'none' : 'underline',
                fontWeight: pathname === '/dashboard' ? 'bold' : 'normal'
              }}
            >
              Dashboard
            </button>
          )}

          {/* Auth Section */}
          {loading ? (
            <span style={{ color: '#666', fontSize: '14px' }}>Loading...</span>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Hello, {user.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '3px'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/signin')}
              style={{
                backgroundColor: '#4169e1',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                borderRadius: '3px'
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}