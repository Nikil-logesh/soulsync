'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  
  // Define mood type
  type Mood = {
    id: string;
    emoji: string;
    label: string;
    color: string;
  };
  
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showMoodAnimation, setShowMoodAnimation] = useState(false);

  // Mood options
  const moods: Mood[] = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD93D' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#FF6B6B' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: '#FF4757' },
    { id: 'demotivated', emoji: '😞', label: 'Demotivated', color: '#A0A0A0' },
    { id: 'worthless', emoji: '😔', label: 'Worthless', color: '#74B9FF' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#A29BFE' }
  ];

  // Handle mood selection
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowMoodAnimation(true);
    
    // Save mood to localStorage for AI chat context
    localStorage.setItem('userCurrentMood', JSON.stringify({
      mood: mood.id,
      label: mood.label,
      emoji: mood.emoji,
      timestamp: new Date().toISOString()
    }));

    // Reset animation after 2 seconds
    setTimeout(() => {
      setShowMoodAnimation(false);
    }, 2000);
  };

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
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '320px',
        backgroundColor: 'white',
        padding: '32px 24px',
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Expert Consultation Card */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#fff3cd',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #ffc107'
          }}>
            <UserIcon style={{ width: '32px', height: '32px', color: '#856404' }} />
          </div>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: '20px'
          }}>
            Get a dedicated voice / video session with an expert for a more focused experience
          </p>
          <Link 
            href="/book-demo"
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            BOOK AN APPOINTMENT
          </Link>
        </div>
        
        {/* Quick Actions */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '16px'
          }}>
            Quick Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              href="/prompt"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#212529',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
            >
              <ChatBubbleLeftIcon style={{ width: '20px', height: '20px', marginRight: '12px', color: '#28a745' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>AI Chat</span>
            </Link>
            
            <Link 
              href="/screening"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#212529',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
            >
              <ClipboardDocumentCheckIcon style={{ width: '20px', height: '20px', marginRight: '12px', color: '#007bff' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Screening</span>
            </Link>
            
            <Link 
              href="/resources"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#212529',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
            >
              <BookOpenIcon style={{ width: '20px', height: '20px', marginRight: '12px', color: '#fd7e14' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Resources</span>
            </Link>
            
            <Link 
              href="/helplines"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#212529',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '12px' }}>📞</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Helplines</span>
            </Link>
            
            <Link 
              href="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#212529',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
            >
              <UserIcon style={{ width: '20px', height: '20px', marginRight: '12px', color: '#6f42c1' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '32px 40px',
        maxWidth: 'calc(100vw - 320px)',
        overflow: 'auto'
      }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '8px'
          }}>
            My Mental Wellness Hub
          </h1>
          <p style={{
            color: '#6c757d',
            fontSize: '16px',
            marginBottom: '0'
          }}>
            Hello, {anonymousName} • {institution}
          </p>
        </div>

        {/* My Experts Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#495057',
              margin: 0
            }}>
              My Experts
            </h2>
            <button style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#495057',
              cursor: 'pointer'
            }}>
              Explore Experts
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', marginRight: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e9ecef',
                backgroundImage: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236c757d"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>)',
                backgroundSize: '20px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                marginRight: '-8px',
                border: '2px solid white'
              }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ffc107',
                backgroundImage: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>)',
                backgroundSize: '20px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                marginRight: '-8px',
                border: '2px solid white'
              }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#28a745',
                backgroundImage: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>)',
                backgroundSize: '20px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                border: '2px solid white'
              }}></div>
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                margin: '0 0 4px 0'
              }}>
                Begin your first session...
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: 0
              }}>
                Chat right now with an expert on any topic you are seeking answers for.
              </p>
            </div>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#6c757d',
            margin: 0
          }}>
            23 people are taking sessions
          </p>
        </div>

        {/* Mood Tracking Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#495057',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            How are you feeling today?
          </h2>
          
          {/* Selected mood feedback */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {selectedMood.emoji}
              </div>
              <p style={{ 
                margin: 0, 
                color: '#666', 
                fontSize: '16px'
              }}>
                You're feeling <strong style={{ color: selectedMood.color }}>{selectedMood.label}</strong>
              </p>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: '#888'
              }}>
                This will help our AI provide better support in chat
              </p>
            </motion.div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {moods.map((mood) => (
              <motion.div
                key={mood.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '16px',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
              >
                <motion.div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: selectedMood?.id === mood.id 
                      ? `${mood.color}40` 
                      : mood.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginBottom: '8px',
                    border: selectedMood?.id === mood.id 
                      ? `3px solid ${mood.color}` 
                      : '3px solid white',
                    boxShadow: selectedMood?.id === mood.id 
                      ? `0 4px 12px ${mood.color}60`
                      : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  animate={selectedMood?.id === mood.id && showMoodAnimation ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, 15, -15, 0]
                  } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {mood.emoji}
                </motion.div>
                <span style={{
                  fontSize: '14px',
                  color: selectedMood?.id === mood.id ? mood.color : '#495057',
                  fontWeight: selectedMood?.id === mood.id ? '600' : '500'
                }}>
                  {mood.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Self Test Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ffc107',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📋
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#495057',
                margin: '0 0 4px 0'
              }}>
                SELF TEST
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: 0
              }}>
                Take a quick mental health assessment
              </p>
            </div>
            <button style={{
              marginLeft: 'auto',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/screening')}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
