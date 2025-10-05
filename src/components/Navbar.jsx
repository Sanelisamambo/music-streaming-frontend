import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    // Smooth redirect to home after logout
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Exclusive Solo Brand Logo */}
        <Link to="/" className="nav-logo">
          🎵 EXCLUSIVE SOLO
        </Link>
        
        <div className="nav-links">
          {/* Home Link */}
          <Link to="/" className="nav-link">
            Home
          </Link>

          {/* Browse Music Link - Shows different based on auth */}
          {isAuthenticated ? (
            <Link to="/songs" className="nav-link">
              🎧 Browse Music
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              🎧 Browse Music
            </Link>
          )}
          
          {isAuthenticated ? (
            <>
              {/* Upload Music - Only for Artist */}
              {user && user.role === 'artist' && (
                <Link to="/upload" className="nav-link" style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(0, 212, 255, 0.1))',
                  border: '1px solid rgba(212, 175, 55, 0.4)'
                }}>
                  ⬆️ Upload Track
                </Link>
              )}

              {/* User Welcome with Role Badge */}
              <span className="user-welcome" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: user?.role === 'artist' 
                  ? 'rgba(212, 175, 55, 0.1)' 
                  : 'rgba(0, 212, 255, 0.1)',
                border: user?.role === 'artist'
                  ? '1px solid rgba(212, 175, 55, 0.3)'
                  : '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '10px',
                fontSize: '0.95rem'
              }}>
                <span style={{
                  color: user?.role === 'artist' ? '#d4af37' : '#00d4ff',
                  fontWeight: '600'
                }}>
                  {user?.role === 'artist' ? '🎤 Artist' : '👂 Listener'}
                </span>
                <span style={{ color: '#c0c0c0' }}>|</span>
                <span style={{ color: '#e5e4e2' }}>{user?.username}</span>
              </span>

              {/* Logout Button */}
              <button 
                className="nav-link logout-btn" 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '1.1rem'
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              {/* Login/Register for unauthenticated users */}
              <Link to="/login" className="nav-link" style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent)'
              }}>
                🔑 Login
              </Link>
              
              <Link to="/register" className="nav-link" style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), transparent)',
                border: '1px solid rgba(0, 212, 255, 0.3)'
              }}>
                ✨ Join Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
