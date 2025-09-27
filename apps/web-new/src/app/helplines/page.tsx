'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../hooks/useLocation';

interface Helpline {
  name: string;
  phone: string;
  description: string;
  type: 'crisis' | 'counseling' | 'youth' | 'general';
  available: string;
  languages?: string[];
}

interface StateResource {
  state: string;
  region: string;
  helplines: Helpline[];
  localResources?: {
    hospitals: string[];
    counselingCenters: string[];
    youthPrograms: string[];
  };
}

const nationalHelplines: Helpline[] = [
  {
    name: 'Free 24/7 mental health support across India',
    phone: '1860-2662-345',
    description: 'Confidential assessment for depression symptoms. Designed to understand mood challenges faced by Indian students and young adults including academic pressure and family expectations.',
    type: 'crisis',
    available: '24/7',
    languages: ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati']
  },
  {
    name: 'Professional counseling and emotional support',
    phone: '9152987821',
    description: 'Professional counseling and emotional support',
    type: 'counseling',
    available: '10 AM - 8 PM',
    languages: ['Hindi', 'English', 'Marathi']
  },
  {
    name: 'AASRA Suicide Prevention',
    phone: '91-22-2754-6669',
    description: 'Suicide prevention and crisis intervention',
    type: 'crisis',
    available: '24/7',
    languages: ['Hindi', 'English']
  }
];

export default function HelplinesPage() {
  const { user } = useAuth();
  const { location } = useLocation();
  const [selectedState, setSelectedState] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (location?.state) {
      setSelectedState(location.state);
    }
  }, [location]);

  const filteredHelplines = (helplines: Helpline[]) => {
    if (filterType === 'all') return helplines;
    return helplines.filter(helpline => helpline.type === filterType);
  };

  const typeFilters = [
    { id: 'all', name: 'All Types', icon: '📞' },
    { id: 'crisis', name: 'Crisis Support', icon: '🚨' },
    { id: 'counseling', name: 'Counseling', icon: '💬' },
    { id: 'youth', name: 'Youth Support', icon: '👥' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '42px', 
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Mental Health Helplines Directory 📞
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            Find immediate mental health support across India. All helplines are confidential, non-judgmental, and specifically trained to help Indian youth overcome stigma and access care.
          </p>
          
          {location && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginTop: '16px',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              📍 Your location: {location.city}, {location.state} - Showing local resources
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '-40px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Emergency Banner */}
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '24px'
          }}>
            🚨 In Crisis? Call Immediately
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {nationalHelplines.map((helpline, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #fecaca',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '16px'
                }}>
                  {helpline.name}
                </h3>
                <a
                  href={`tel:${helpline.phone}`}
                  style={{
                    display: 'block',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    textAlign: 'center',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '12px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  📞 {helpline.phone}
                </a>
                <p style={{
                  fontSize: '12px',
                  color: '#7f1d1d',
                  margin: 0
                }}>
                  {helpline.available}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {typeFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilterType(filter.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: filterType === filter.id ? '#10b981' : '#f1f5f9',
                    color: filterType === filter.id ? 'white' : '#475569'
                  }}
                  onMouseEnter={(e) => {
                    if (filterType !== filter.id) {
                      e.currentTarget.style.backgroundColor = '#dcfce7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterType !== filter.id) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }
                  }}
                >
                  {filter.icon} {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Helplines Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>
          {/* National Helplines */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              🇮🇳 National Helplines
            </h2>
            <p style={{
              color: '#4a5568',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              Available from anywhere in India
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {filteredHelplines(nationalHelplines).map((helpline, index) => (
                <div key={index} style={{
                  borderLeft: '4px solid #10b981',
                  paddingLeft: '20px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0 12px 12px 0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '8px'
                      }}>
                        {helpline.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#4a5568',
                        marginBottom: '12px',
                        lineHeight: '1.5'
                      }}>
                        {helpline.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <span>⏰ {helpline.available}</span>
                        <span>🗣️ {helpline.languages?.join(', ')}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${helpline.phone}`}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginLeft: '16px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      📞 Call
                    </a>
                  </div>
                  <div>
                    <a
                      href={`tel:${helpline.phone}`}
                      style={{
                        color: '#10b981',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#10b981'}
                    >
                      {helpline.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Resources */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              📍 Local mental health support in Southern India
            </h2>
            <p style={{
              color: '#4a5568',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              Suicide prevention helpline serving Tamil Nadu
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{
                borderLeft: '4px solid #3b82f6',
                paddingLeft: '20px',
                paddingTop: '16px',
                paddingBottom: '16px',
                backgroundColor: '#eff6ff',
                borderRadius: '0 12px 12px 0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '8px'
                    }}>
                      Suicide prevention helpline serving Tamil Nadu
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <span>⏰ 24/7</span>
                      <span>🗣️ Tamil, English, Hindi</span>
                    </div>
                  </div>
                  <a
                    href="tel:044-24640050"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginLeft: '16px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  >
                    📞 Call
                  </a>
                </div>
                <div>
                  <a
                    href="tel:044-24640050"
                    style={{
                      color: '#3b82f6',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    044-24640050
                  </a>
                </div>
              </div>

              <div style={{
                borderLeft: '4px solid #8b5cf6',
                paddingLeft: '20px',
                paddingTop: '16px',
                paddingBottom: '16px',
                backgroundColor: '#f5f3ff',
                borderRadius: '0 12px 12px 0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '8px'
                    }}>
                      Mental health counseling and support
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <span>⏰ 8 AM - 8 PM</span>
                      <span>🗣️ Tamil, English</span>
                    </div>
                  </div>
                  <a
                    href="tel:0422-2544042"
                    style={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginLeft: '16px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
                  >
                    📞 Call
                  </a>
                </div>
                <div>
                  <a
                    href="tel:0422-2544042"
                    style={{
                      color: '#8b5cf6',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    0422-2544042
                  </a>
                </div>
              </div>

              <div style={{
                borderLeft: '4px solid #f59e0b',
                paddingLeft: '20px',
                paddingTop: '16px',
                paddingBottom: '16px',
                backgroundColor: '#fffbeb',
                borderRadius: '0 12px 12px 0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '8px'
                    }}>
                      Specialized support for Tamil youth and students
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <span>⏰ 10 AM - 7 PM</span>
                      <span>🗣️ Tamil, English</span>
                    </div>
                  </div>
                  <a
                    href="tel:044-28512345"
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginLeft: '16px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                  >
                    📞 Call
                  </a>
                </div>
                <div>
                  <a
                    href="tel:044-28512345"
                    style={{
                      color: '#f59e0b',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    044-28512345
                  </a>
                </div>
              </div>
            </div>

            {/* Hospitals */}
            <div style={{
              marginTop: '32px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                🏥 Hospitals:
              </h4>
              <p style={{
                color: '#4a5568',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Government General Hospital Chennai, Madras Medical College, Apollo Hospitals
              </p>
            </div>
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
            Your mental health support is just a call away.
          </p>
        </div>
      </footer>
    </div>
  );
}