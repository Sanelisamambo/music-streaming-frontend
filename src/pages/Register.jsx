import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'listener'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      // Redirect to songs page after successful registration
      navigate('/songs');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Join as Listener</h2>
        <p style={{ textAlign: 'center', color: '#cccccc', marginBottom: '1.5rem' }}>
          Create your account to start browsing music
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input type="hidden" name="role" value="listener" />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join and Browse Music'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#888' }}>
          <p>Already have an account? <a href="/login" style={{ color: '#00ff88' }}>Login here</a></p>
        </div>

        {/* Artist Information */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(0, 255, 136, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#00ff88' }}>
            <strong>Artist?</strong> Use the pre-configured artist account to manage music.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
