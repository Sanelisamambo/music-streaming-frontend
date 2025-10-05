import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/songs');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="premium-background"></div>
      <div className="glow-effect"></div>
      
      <div className="home">
        <div className="hero-content">
          {/* Exclusive Solo Branding */}
          <div style={{
            marginBottom: '3rem',
            padding: '2rem',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>EXCLUSIVE SOLO</h1>
            <div className="subtitle">Premium Music Experience</div>
          </div>

          <div className="description">
            Experience the exclusive collection of <strong>Exclusive Solo</strong>. 
            Stream premium quality music, download your favorites, and immerse yourself 
            in a world of sophisticated sound.
          </div>
          
          <div className="cta-buttons">
            <Link to="/login" className="cta-button cta-primary">
              🎵 Enter Studio
            </Link>
            <Link to="/register" className="cta-button cta-secondary">
              Join Inner Circle
            </Link>
          </div>

          {/* Premium Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '4rem',
            maxWidth: '1000px'
          }}>
            <div style={{
              background: 'rgba(212, 175, 55, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
              <h3>Lossless Audio</h3>
              <p>Studio-quality sound experience</p>
            </div>
            
            <div style={{
              background: 'rgba(0, 212, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3>Any Device</h3>
              <p>Stream anywhere, anytime</p>
            </div>
            
            <div style={{
              background: 'rgba(0, 255, 136, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3>Instant Access</h3>
              <p>No delays, pure music</p>
            </div>
          </div>

          {/* Artist Access */}
          <div className="artist-info" style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(138, 43, 226, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            maxWidth: '500px',
            margin: '4rem auto 0'
          }}>
            <h3 style={{ color: '#8a2be2', marginBottom: '1rem' }}>🎤 Exclusive Solo Artist Portal</h3>
            <p>Manage your premium music collection and connect with your audience.</p>
            <Link to="/login" className="cta-button cta-primary" style={{
              marginTop: '1rem',
              padding: '1rem 2rem',
              fontSize: '1rem',
              display: 'inline-block'
            }}>
              Artist Access
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;