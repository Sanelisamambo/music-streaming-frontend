import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    album: '',
    duration: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, uploadSong } = useAuth();
  const navigate = useNavigate();

  // Check if user is an artist - with better redirect
  if (!user || user.role !== 'artist') {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h2>🎵 Artist Access Required</h2>
          <p>This feature is only available for artists.</p>
          <div style={{ marginTop: '2rem' }}>
            <p>To upload music, you need an artist account.</p>
            <button 
              onClick={() => navigate('/register')}
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                color: '#000',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Create Artist Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!audioFile) {
      setError('Please select an audio file');
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('genre', formData.genre);
      uploadData.append('album', formData.album);
      uploadData.append('duration', formData.duration);
      uploadData.append('audio', audioFile);

      await uploadSong(uploadData);
      navigate('/songs');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Upload New Song</h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          
          <input
            type="text"
            name="genre"
            placeholder="Genre (e.g., Rock, Pop, Hip Hop)"
            value={formData.genre}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          
          <input
            type="text"
            name="album"
            placeholder="Album Name (optional)"
            value={formData.album}
            onChange={handleInputChange}
            disabled={loading}
          />
          
          <input
            type="number"
            name="duration"
            placeholder="Duration in seconds"
            value={formData.duration}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          
          <div className="file-upload-section">
            <label>Audio File (MP3, WAV, etc.) *</label>
            <input
              type="file"
              accept=".mp3,.wav,.ogg,.m4a,.flac"
              onChange={handleFileChange}
              required
              disabled={loading}
            />
            {audioFile && <span>Selected: {audioFile.name}</span>}
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;