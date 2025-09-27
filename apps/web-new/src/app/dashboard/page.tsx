'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftIcon, 
  UserIcon, 
  ChartBarIcon, 
  PlusIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { useSafeAuth } from '../../contexts/useSafeAuth';

// Disable static optimization for this page
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userRole, loading } = useSafeAuth();

  // Redirect to signin if not authenticated
  useEffect(() => {
    // Only redirect if loading is complete and user is definitely not authenticated
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '256px'
      }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '64px',
            height: '64px',
            border: '4px solid #2563eb',
            borderTop: '4px solid transparent',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  // Extract domain and determine institution (for authenticated users)
  const emailDomain = user?.email?.split('@')[1];
  let institution = user ? 'Individual' : 'Guest Mode';
  let institutionType = user ? 'personal' : 'guest';

  const domainMap: { [key: string]: string } = {
    'sairamtap.edu.in': 'Sairam Engineering College',
    'iitm.ac.in': 'IIT Madras',
    'anna.edu.in': 'Anna University',
    'vit.edu.in': 'VIT University',
  };

  if (emailDomain && domainMap[emailDomain]) {
    institution = domainMap[emailDomain];
    institutionType = 'educational';
  }

  const generateAnonymousName = (email: string) => {
    const adjectives = ['Peaceful', 'Calm', 'Serene', 'Mindful', 'Zen', 'Bright', 'Wise', 'Kind'];
    const nouns = ['Spirit', 'Soul', 'Mind', 'Heart', 'Star', 'Light', 'Wave', 'Leaf'];
    
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const adjIndex = Math.abs(hash) % adjectives.length;
    const nounIndex = Math.abs(Math.floor(hash / 10)) % nouns.length;
    const number = Math.abs(hash % 1000);
    
    return `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
  };

  const anonymousName = user?.email ? generateAnonymousName(user.email) : 'GuestUser123';

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #dbeafe 0%, #e5d3ff 50%, #fce7f3 100%)',
        zIndex: -10,
        borderRadius: '16px'
      }}></div>
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating decorations */}
        <motion.div
          animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          style={{
            position: 'absolute',
            width: '128px',
            height: '128px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            top: '16px',
            right: '16px',
            filter: 'blur(40px)'
          }}
        />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          position: 'relative',
          zIndex: 10
        }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ rotate: { repeat: Infinity, duration: 4 } }}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <UserIcon style={{ width: '40px', height: '40px', color: 'white' }} />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '8px',
                margin: 0
              }}
            >
              Welcome back!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '20px',
                opacity: 0.9,
                marginBottom: '12px',
                margin: 0
              }}
            >
              Hello, {anonymousName}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                backgroundColor: institutionType === 'educational' 
                  ? 'rgba(59, 130, 246, 0.3)' 
                  : 'rgba(107, 114, 128, 0.3)',
                border: institutionType === 'educational'
                  ? '1px solid rgba(147, 197, 253, 1)'
                  : '1px solid rgba(156, 163, 175, 1)'
              }}>
                {institution}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/prompt" 
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #10b981 0%, #22c55e 50%, #14b8a6 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              height: '100%',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 8 }}
              style={{
                position: 'absolute',
                width: '96px',
                height: '96px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                top: '8px',
                right: '8px',
                filter: 'blur(20px)'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              justifyContent: 'space-between'
            }}>
              <motion.div 
                whileHover={{ rotate: 15 }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}
              >
                <ChatBubbleLeftIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </motion.div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>💬 AI Chat</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Talk with SoulSync</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/screening" 
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              height: '100%',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 10 }}
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                bottom: '8px',
                right: '8px',
                filter: 'blur(20px)'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              justifyContent: 'space-between'
            }}>
              <motion.div 
                whileHover={{ rotate: 15 }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}
              >
                <ClipboardDocumentCheckIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </motion.div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>📋 Screening</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Mental health assessments</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/resources" 
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              height: '100%',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 9 }}
              style={{
                position: 'absolute',
                width: '112px',
                height: '112px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                top: '4px',
                left: '4px',
                filter: 'blur(20px)'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              justifyContent: 'space-between'
            }}>
              <motion.div 
                whileHover={{ rotate: 15 }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}
              >
                <BookOpenIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </motion.div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>📚 Resources</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Youth mental wellness hub</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.75 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/helplines" 
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 50%, #f43f5e 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              height: '100%',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 7 }}
              style={{
                position: 'absolute',
                width: '96px',
                height: '96px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                top: '8px',
                right: '8px',
                filter: 'blur(20px)'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              justifyContent: 'space-between'
            }}>
              <motion.div 
                whileHover={{ rotate: 15 }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}
              >
                <span style={{ fontSize: '24px' }}>📞</span>
              </motion.div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>📞 Helplines</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Crisis support & counseling</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/profile" 
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6366f1 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              height: '100%',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 11 }}
              style={{
                position: 'absolute',
                width: '128px',
                height: '128px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                bottom: '8px',
                right: '8px',
                filter: 'blur(20px)'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              justifyContent: 'space-between'
            }}>
              <motion.div 
                whileHover={{ rotate: 15 }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content'
                }}
              >
                <UserIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </motion.div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>👤 Profile</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Manage settings</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Mental Health Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
          alignItems: 'stretch'
        }}
      >
        {/* Screening Section */}
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #eef2ff 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          border: '1px solid rgba(196, 181, 253, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '320px'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#8b5cf6',
                borderRadius: '12px',
                marginRight: '16px'
              }}>
                <ClipboardDocumentCheckIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>Mental Health Screening</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0
                }}>Take validated assessments</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '16px',
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px'
              }}>
                <div>
                  <span style={{
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>PHQ-9</span>
                  <p style={{
                    fontSize: '12px',
                    color: '#4b5563',
                    margin: 0
                  }}>Depression screening</p>
                </div>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 8px',
                  borderRadius: '20px'
                }}>9 questions</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px'
              }}>
                <div>
                  <span style={{
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>GAD-7</span>
                  <p style={{
                    fontSize: '12px',
                    color: '#4b5563',
                    margin: 0
                  }}>Anxiety screening</p>
                </div>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: '20px'
                }}>7 questions</span>
              </div>
            </div>
          </div>
          <Link href="/screening" style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#8b5cf6',
            color: 'white',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
            marginTop: 'auto'
          }}>
            Start Assessment
          </Link>
        </div>

        {/* Resources Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 50%, #fef9c3 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '320px'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#f97316',
                borderRadius: '12px',
                marginRight: '16px'
              }}>
                <PlayIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>Wellness Resources</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0
                }}>Videos, audio, and guides</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '16px',
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>🎥</span>
                  <span style={{
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>Mental Health Videos</span>
                </div>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#fed7aa',
                  color: '#9a3412',
                  padding: '4px 8px',
                  borderRadius: '20px'
                }}>Regional</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>🎧</span>
                  <span style={{
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>Guided Meditations</span>
                </div>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: '20px'
                }}>Audio</span>
              </div>
            </div>
          </div>
          <Link href="/resources" style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#ea580c',
            color: 'white',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
            marginTop: 'auto'
          }}>
            Explore Resources
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #faf5ff 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          animate={{ x: [0, 25, -25, 0], y: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            background: 'linear-gradient(135deg, #bfdbfe 0%, #ddd6fe 100%)',
            opacity: 0.2,
            borderRadius: '50%',
            top: '16px',
            right: '16px',
            filter: 'blur(40px)'
          }}
        />
        
        <h2 style={{
          fontSize: '30px',
          fontWeight: '700',
          marginBottom: '32px',
          color: '#1f2937',
          position: 'relative',
          zIndex: 10
        }}>Your Wellness Journey</h2>
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          position: 'relative',
          zIndex: 10
        }}>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
            style={{
              margin: '0 auto',
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, #bfdbfe 0%, #ddd6fe 50%, #fce7f3 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <PlusIcon style={{ width: '48px', height: '48px', color: '#4b5563' }} />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}
          >
            Start Your Wellness Journey
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              color: '#4b5563',
              marginBottom: '32px',
              maxWidth: '512px',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}
          >
            Begin by chatting with our AI companion and building healthy mental wellness habits.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/prompt" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontWeight: '500',
                  height: '56px',
                  minWidth: '200px'
                }}
              >
                <ChatBubbleLeftIcon style={{ width: '20px', height: '20px' }} />
                <span>Start Chatting</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Global floating elements */}
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
        style={{
          position: 'fixed',
          width: '384px',
          height: '384px',
          backgroundColor: '#bfdbfe',
          opacity: 0.05,
          borderRadius: '50%',
          top: '40px',
          right: '40px',
          filter: 'blur(60px)',
          zIndex: -50
        }}
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 18 }}
        style={{
          position: 'fixed',
          width: '320px',
          height: '320px',
          backgroundColor: '#ddd6fe',
          opacity: 0.05,
          borderRadius: '50%',
          bottom: '40px',
          left: '40px',
          filter: 'blur(60px)',
          zIndex: -50
        }}
      />
    </div>
  );
}