"use client";

export default function AboutPage() {
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
          {/* Logo */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '28px',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              SS
            </div>
          </div>
          
          <h1 style={{ 
            margin: 0, 
            fontSize: '48px', 
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>About SoulSync</h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.9,
            fontWeight: '300',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Bridging the gap between students and mental wellbeing resources through AI-guided support
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
        {/* Mission Statement */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '60px 40px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '24px'
          }}>
            Our Mission
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#4a5568',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            <strong>SoulSync bridges the gap</strong> between students and mental wellbeing resources by offering 
            <strong> AI-guided support, psychoeducational materials, peer forums, and confidential counselling</strong>, 
            all in one immersive platform. Our goal is to make mental health support <strong>accessible, stigma-free, and culturally aware</strong> for students.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#718096',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Explore features such as <strong>personalized AI-guided first-aid support</strong>, 
            <strong> confidential counsellor appointments</strong>, a <strong>resource hub with mental wellness guides</strong>, 
            and <strong>peer-to-peer support forums</strong>. SoulSync is designed to help students navigate <strong>stress, anxiety, and other challenges</strong> in a safe digital environment.
          </p>
        </section>

        {/* Features Grid */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Key Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* AI Support Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                🤖
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                AI-Guided Support
              </h3>
              <p style={{
                color: '#4a5568',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                Personalized AI companion that provides immediate support, coping strategies, and mental health resources tailored to your needs.
              </p>
            </div>

            {/* Counseling Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                👨‍⚕️
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                Professional Counseling
              </h3>
              <p style={{
                color: '#4a5568',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                Connect with licensed mental health professionals through confidential appointments and secure messaging.
              </p>
            </div>

            {/* Resource Hub Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
              📚
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                Resource Hub
              </h3>
              <p style={{
                color: '#4a5568',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                Comprehensive library of mental wellness guides, coping techniques, and educational materials.
              </p>
            </div>

            {/* Community Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                👥
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                Peer Support
              </h3>
              <p style={{
                color: '#4a5568',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                Safe peer-to-peer support forums where students can share experiences and support each other.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '60px 40px',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '40px'
          }}>
            Our Values
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ 
                color: '#667eea', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                🔒 Privacy First
              </h4>
              <p style={{ 
                color: '#4a5568', 
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Your conversations and data are completely confidential and secure.
              </p>
            </div>
            
            <div>
              <h4 style={{ 
                color: '#667eea', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                🌍 Cultural Awareness
              </h4>
              <p style={{ 
                color: '#4a5568', 
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Culturally sensitive support that understands diverse backgrounds.
              </p>
            </div>
            
            <div>
              <h4 style={{ 
                color: '#667eea', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                ♿ Accessibility
              </h4>
              <p style={{ 
                color: '#4a5568', 
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Mental health support should be available to everyone, everywhere.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d3748',
        color: '#e2e8f0',
        padding: '60px 20px 40px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '20px',
              marginBottom: '16px'
            }}>
              SS
            </div>
            <p style={{ 
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              SoulSync
            </p>
          </div>
          
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            opacity: 0.8
          }}>
            © 2024 SoulSync Mental Wellness Platform. All rights reserved. | 
            Empowering students through accessible mental health support.
          </p>
        </div>
      </footer>
    </div>
  );
}