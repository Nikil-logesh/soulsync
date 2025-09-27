"use client";

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Simple Header */}
      <header style={{
        backgroundColor: '#4169e1',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '36px' }}>SoulSync</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>
          About Our Platform
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderBottom: '1px solid #ddd',
        textAlign: 'center'
      }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4169e1',
            textDecoration: 'underline'
          }}
        >
          Home
        </button>
        <button
          onClick={() => window.location.href = '/about'}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#333',
            fontWeight: 'bold'
          }}
        >
          About
        </button>
        <button
          onClick={() => window.location.href = '/contact'}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4169e1',
            textDecoration: 'underline'
          }}
        >
          Contact
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ 
        padding: '40px 20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        
        {/* About Section */}
        <div style={{
          border: '2px solid #4169e1',
          padding: '30px',
          marginBottom: '30px',
          backgroundColor: '#f8f9ff'
        }}>
          <h2 style={{ 
            color: '#4169e1', 
            marginBottom: '20px',
            fontSize: '28px',
            textAlign: 'center'
          }}>
            About SoulSync Mental Wellness Platform
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#333',
            marginBottom: '20px'
          }}>
            SoulSync is a comprehensive digital mental wellness platform designed to provide 
            accessible, personalized mental health support to individuals and communities. 
            Our mission is to break down barriers to mental health care and create a safe, 
            supportive environment for healing and growth.
          </p>

          <p style={{ 
            fontSize: '16px', 
            color: '#333',
            marginBottom: '20px'
          }}>
            Founded with the belief that mental health support should be available to everyone, 
            SoulSync combines cutting-edge AI technology with evidence-based therapeutic approaches 
            to deliver personalized mental wellness experiences.
          </p>
        </div>

        {/* Features Section */}
        <div style={{
          border: '2px solid #28a745',
          padding: '30px',
          marginBottom: '30px',
          backgroundColor: '#f0fff0'
        }}>
          <h3 style={{ 
            color: '#28a745', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            What We Offer
          </h3>
          
          <ul style={{ 
            fontSize: '16px', 
            color: '#333',
            paddingLeft: '20px'
          }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>AI-Powered Mental Health Support:</strong> 24/7 access to personalized coping strategies and guidance
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Cultural Sensitivity:</strong> Support tailored to diverse cultural backgrounds and local contexts
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Privacy & Security:</strong> Enterprise-grade security to protect your personal information
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Crisis Support:</strong> Immediate access to crisis resources and professional referrals
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Campus Integration:</strong> Specialized support for educational institutions
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Multi-language Support:</strong> Available in multiple languages including Tamil and English
            </li>
          </ul>
        </div>

        {/* Mission Section */}
        <div style={{
          border: '2px solid #dc3545',
          padding: '30px',
          marginBottom: '30px',
          backgroundColor: '#fff5f5'
        }}>
          <h3 style={{ 
            color: '#dc3545', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Our Mission
          </h3>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#333',
            marginBottom: '15px'
          }}>
            To democratize access to mental health support by leveraging technology to create 
            scalable, personalized, and culturally-sensitive mental wellness solutions.
          </p>

          <p style={{ 
            fontSize: '16px', 
            color: '#333'
          }}>
            We believe that everyone deserves access to quality mental health support, regardless 
            of their location, background, or circumstances. SoulSync is committed to reducing 
            stigma and making mental wellness resources more accessible to communities worldwide.
          </p>
        </div>

        {/* Contact Info */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            color: '#4169e1', 
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            Get in Touch
          </h4>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#333',
            marginBottom: '15px'
          }}>
            Have questions about SoulSync or want to learn more about our services?
          </p>

          <button
            onClick={() => window.location.href = '/contact'}
            style={{
              backgroundColor: '#4169e1',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '4px'
            }}
          >
            Contact Us
          </button>
        </div>

      </main>

      {/* Simple Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #ddd',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ color: '#666', margin: 0 }}>
          © 2024 SoulSync Mental Wellness Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}