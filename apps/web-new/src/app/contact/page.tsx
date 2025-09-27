"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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
          }}>Contact SoulSync</h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.5'
          }}>
            We're here to help with your mental wellness journey
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '-30px auto 0',
        padding: '0 20px',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '40px'
        }}>
          {/* Contact Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            padding: '40px',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              color: '#1a202c', 
              marginBottom: '24px', 
              fontSize: '28px',
              fontWeight: '600'
            }}>
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Inquiry Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    color: '#2d3748',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  placeholder="Your full name"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  placeholder="your.email@example.com"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  placeholder="What's this about?"
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Team */}
          <div>
            {/* Contact Info Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '40px',
              marginBottom: '32px'
            }}>
              <h2 style={{ 
                color: '#1a202c', 
                marginBottom: '24px', 
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Get in Touch
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '20px', marginRight: '12px' }}>📧</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2d3748', marginBottom: '4px' }}>Email</div>
                    <a 
                      href="mailto:support@soulsync.com" 
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      support@soulsync.com
                    </a>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '20px', marginRight: '12px' }}>📞</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2d3748', marginBottom: '4px' }}>Phone</div>
                    <span style={{ color: '#4a5568', fontSize: '14px' }}>
                      +1 (555) 123-SOUL
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', marginTop: '2px' }}>📍</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2d3748', marginBottom: '4px' }}>Address</div>
                    <span style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.4' }}>
                      123 Wellness Street<br />
                      Mental Health District<br />
                      MH 12345, United States
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ fontSize: '20px', marginRight: '12px', marginTop: '2px' }}>⏰</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2d3748', marginBottom: '4px' }}>Support Hours</div>
                    <span style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.4' }}>
                      AI Support: 24/7<br />
                      Human Support: Mon-Fri 9AM-5PM EST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '40px'
            }}>
              <h3 style={{ 
                color: '#1a202c', 
                marginBottom: '24px', 
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Development Team
              </h3>
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ 
                    color: '#2d3748', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Nikil Logesh
                  </h4>
                  <p style={{ 
                    color: '#4a5568', 
                    margin: 0,
                    fontSize: '14px'
                  }}>
                    Lead Developer & Mental Health AI Specialist
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#edf2f7',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    color: '#4a5568', 
                    margin: 0,
                    fontSize: '13px',
                    fontStyle: 'italic'
                  }}>
                    "Committed to making mental health support accessible and effective for everyone through innovative technology."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d3748',
        color: '#e2e8f0',
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            opacity: 0.8
          }}>
            © 2024 SoulSync Mental Wellness Platform. All rights reserved. | 
            We're here to support your mental health journey.
          </p>
        </div>
      </footer>
    </div>
  );
}