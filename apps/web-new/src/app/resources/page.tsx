"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'guide';
  category: string;
  language: string;
  duration?: number;
  thumbnailUrl?: string;
  url: string;
  severity: 'all' | 'mild' | 'moderate' | 'severe';
  tags: string[];
  views: number;
  likes: number;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Comprehensive directory of mental health resources across Indian states',
    description: 'Comprehensive directory of mental health resources across Indian states including Assam, Bengaluru, Chennai, Goa, Gujarat, Kerala, Kolkata, Mumbai, New Delhi, Pune with organizations, helplines, and counseling services.',
    type: 'guide',
    category: 'Mental Health Resources',
    language: 'English',
    duration: 600,
    thumbnailUrl: '/api/placeholder/guide-thumb-1',
    url: 'https://www.therapyroute.com/article/free-mental-health-resources-in-india-by-therapyroute',
    severity: 'all',
    tags: ['state-wise', 'helplines', 'counseling', 'organizations'],
    views: 2456,
    likes: 189
  },
  {
    id: '2',
    title: 'Government of India\'s 24/7 toll-free helpline (14416) providing tele-counselling, psychotherapy, psychiatric consultation',
    description: 'Government of India\'s 24/7 toll-free helpline (14416) providing tele-counselling, psychotherapy, psychiatric consultation in 20+ languages across India.',
    type: 'guide',
    category: 'Government Resources',
    language: 'English',
    duration: 300,
    thumbnailUrl: '/api/placeholder/guide-thumb-2',
    url: 'https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=153277&ModuleId=3',
    severity: 'all',
    tags: ['government', 'helpline', 'multilingual', 'tele-counseling'],
    views: 3421,
    likes: 267
  },
  {
    id: '3',
    title: 'Mental health NGO with awareness campaigns and helpline services in multiple Indian languages',
    description: 'Mental health NGO with awareness campaigns and helpline services in multiple Indian languages for crisis support and guidance.',
    type: 'guide',
    category: 'NGO Resources',
    language: 'English',
    duration: 240,
    thumbnailUrl: '/api/placeholder/guide-thumb-3',
    url: 'https://www.thelivelovelaughfoundation.org/find-help/helplines',
    severity: 'moderate',
    tags: ['ngo', 'helplines', 'crisis-support', 'multilingual'],
    views: 1823,
    likes: 145
  }
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let filtered = resources;

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(resource => resource.language.toLowerCase() === selectedLanguage);
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [selectedType, selectedLanguage, searchQuery, resources]);

  const typeFilters = [
    { id: 'all', name: 'All Content', icon: '📚' },
    { id: 'video', name: 'Videos', icon: '🎥' },
    { id: 'audio', name: 'Audio', icon: '🎧' },
    { id: 'guide', name: 'Guides', icon: '📖' }
  ];

  const languageOptions = [
    { id: 'all', name: 'All Languages' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'bengali', name: 'Bengali' }
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            Mental Health Resources
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            Psychoeducational content in regional languages
          </p>
          <p style={{ 
            fontSize: '16px', 
            opacity: 0.8,
            fontWeight: '300',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore our comprehensive library of videos, audio guides, and articles designed to support your mental wellness journey. All content is culturally relevant and available in multiple regional languages.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '-40px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Search and Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '32px',
          marginBottom: '40px'
        }}>
          {/* Search Bar */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              position: 'relative',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 24px 16px 48px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                color: '#9ca3af'
              }}>
                🔍
              </div>
              <button style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                🔧 Filters
              </button>
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '14px',
            marginBottom: '24px'
          }}>
            Showing {filteredResources.length} of {resources.length} resources
          </p>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {typeFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedType(filter.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: selectedType === filter.id ? '#667eea' : '#f1f5f9',
                  color: selectedType === filter.id ? 'white' : '#475569'
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== filter.id) {
                    e.currentTarget.style.backgroundColor = '#e0e7ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== filter.id) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
              >
                {filter.icon} {filter.name}
              </button>
            ))}
          </div>

          {/* Language Filter */}
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#475569',
                outline: 'none'
              }}
            >
              {languageOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              }}
            >
              {/* Resource Thumbnail */}
              <div style={{
                height: '200px',
                background: resource.type === 'video' ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' :
                           resource.type === 'audio' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                           'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '48px',
                  color: 'white'
                }}>
                  {resource.type === 'video' ? '🎥' :
                   resource.type === 'audio' ? '🎧' : '📖'}
                </div>
                
                {resource.duration && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {formatDuration(resource.duration)}
                  </div>
                )}
                
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {resource.category}
                </div>
              </div>

              {/* Resource Content */}
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {resource.title}
                </h3>
                
                <p style={{
                  color: '#4a5568',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}>
                  {resource.description}
                </p>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Resource Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>👁️ {resource.views.toLocaleString()}</span>
                    <span>❤️ {resource.likes}</span>
                  </div>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {resource.language}
                  </span>
                </div>

                {/* Action Button */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    backgroundColor: resource.type === 'video' ? '#3b82f6' :
                                   resource.type === 'audio' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  📖 Read Guide
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '60px 40px',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '12px'
            }}>
              No Resources Found
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              Try adjusting your search criteria or filters to find relevant resources.
            </p>
          </div>
        )}
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
            Empowering minds through accessible resources.
          </p>
        </div>
      </footer>
    </div>
  );
}