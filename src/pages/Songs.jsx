import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingSong, setPlayingSong] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, getAllSongs, deleteSong } = useAuth();

  // Use ref to persist the audio instance
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs();
    
    // Cleanup audio on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const songsData = await getAllSongs();
      setSongs(songsData);
    } catch (err) {
      setError('Failed to load music library');
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres for filter
  const genres = ['all', ...new Set(songs.map(song => song.genre).filter(Boolean))];

  // Filter songs based on genre and search
  const filteredSongs = songs.filter(song => {
    const matchesGenre = selectedGenre === 'all' || song.genre === selectedGenre;
    const matchesSearch = song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getGenreColor = (genre) => {
    const colors = {
      'hip hop': '#ff6b6b',
      'rock': '#4ecdc4',
      'pop': '#45b7d1',
      'jazz': '#96ceb4',
      'electronic': '#feca57',
      'classical': '#ff9ff3',
      'r&b': '#54a0ff',
      'reggae': '#1dd1a1',
      'country': '#ff9f43'
    };
    return colors[genre?.toLowerCase()] || '#d4af37';
  };

  const generateSongArt = (song) => {
    const title = song.title || 'Exclusive Solo';
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      ['#d4af37', '#00d4ff'],
      ['#8a2be2', '#00ff88'],
      ['#ff6b6b', '#4ecdc4'],
      ['#feca57', '#ff9ff3'],
      ['#54a0ff', '#1dd1a1'],
    ];
    
    const colorPair = colors[Math.abs(hash) % colors.length];
    return `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`;
  };

const handlePlay = async (song) => {
  try {
    // ✅ FIX: Use Cloudinary URL directly (no backend URL prepending)
    const audioUrl = song.fileUrl;
    console.log('Playing from URL:', audioUrl);
    
    // If clicking the same song that's currently playing, toggle pause/play
    if (playingSong && playingSong.id === song._id) {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setPlayingSong({ ...playingSong, isPlaying: true });
      } else {
        audioRef.current.pause();
        setPlayingSong({ ...playingSong, isPlaying: false });
      }
      return;
    }
    
    // If a different song is playing, stop it first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Create new audio instance
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners for the audio
    audio.addEventListener('ended', () => {
      setPlayingSong(null);
      audioRef.current = null;
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio element error:', e);
      setError('Failed to play audio. The file may be corrupted or unavailable.');
      setPlayingSong(null);
      audioRef.current = null;
    });
    
    // Play the new song
    await audio.play();
    setPlayingSong({ id: song._id, audio, isPlaying: true });
    
    // Increment play count in backend
    await fetch(`https://music-platform-backend-qru3.onrender.com/api/songs/${song._id}/play`, {
      method: 'POST'
    });
    
  } catch (err) {
    setError('Failed to play track');
    console.error('Play error:', err);
  }
};

  const handleDownload = async (song) => {
  try {
    await fetch(`https://music-platform-backend-qru3.onrender.com/api/songs/${song._id}/download`, {
      method: 'POST'
    });
    
    // ✅ FIX: Use Cloudinary URL directly for download
    const downloadUrl = song.fileUrl;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = song.fileName || 'exclusive-solo-track';
    link.target = '_blank'; // Open in new tab for Cloudinary
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (err) {
    setError('Download failed');
  }
};
 // In your Songs.jsx, replace the handleDelete function with this:

const handleDelete = async (songId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // Use the admin delete endpoint
    const response = await fetch(`https://music-platform-backend-qru3.onrender.com/api/songs/${songId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete failed');
    }

    // Remove the song from the local state
    setSongs(songs.filter(song => song._id !== songId));
    setDeleteConfirm(null);
    setError('');
  } catch (err) {
    console.error('Delete error:', err);
    setError(err.message || 'Failed to delete song. You may not own this song.');
  }
};

// And make sure isSongOwner is simple:
const isSongOwner = (song) => {
  return user && user.role === 'artist'; // Artist can delete any song
};

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingSong(null);
  };

  // ... rest of your component code remains the same until the JSX return ...

  return (
    <div className="songs-page">
      <div className="premium-background"></div>
      <div className="glow-effect"></div>
      
      <div className="songs-container">
        {/* Premium Header Section */}
        <div className="songs-header">
          <h2>🎵 Exclusive Music Library</h2>
          <p className="songs-subtitle">Premium tracks from Exclusive Solo • Studio Quality Audio</p>
          
          {playingSong && (
            <div className="now-playing-premium">
              <div className="now-playing-content">
                <div className="playing-indicator">
                  <div className="equalizer">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span className="playing-text">
                  {playingSong.isPlaying ? 'Now Playing:' : 'Paused:'}
                </span>
                <span className="playing-title">
                  {songs.find(s => s._id === playingSong.id)?.title}
                </span>
                <button onClick={stopPlayback} className="stop-btn-premium">
                  ⏹️ Stop
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="controls-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tracks, artist, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <span className="filter-label">Genre:</span>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>

          <div className="stats-badge">
            <span className="stat-number">{filteredSongs.length}</span>
            <span className="stat-label">Premium Tracks</span>
          </div>
        </div>

        {error && (
          <div className="error-message-premium">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal-premium">
            <div className="delete-confirmation-premium">
              <div className="delete-icon">🗑️</div>
              <h3>Delete Track</h3>
              <p>This action cannot be undone. The track will be permanently removed from the library.</p>
              <div className="delete-actions-premium">
                <button 
                  className="cancel-btn-premium"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn-premium"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <div className="no-songs-premium">
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>No tracks found</h3>
              <p>Try adjusting your search or filter criteria</p>
              {(searchTerm || selectedGenre !== 'all') && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="songs-grid-premium">
            {filteredSongs.map((song) => (
              <div key={song._id} className="song-card-premium">
                <div className="song-art-container">
                  <div 
                    className="song-art" 
                    style={{ background: generateSongArt(song) }}
                  >
                    {song.coverArtUrl ? (
                      <img 
                        src={`https://music-platform-backend-qru3.onrender.com${song.coverArtUrl}`} 
                        alt={song.title}
                        className="cover-image"
                      />
                    ) : (
                      <div className="art-placeholder">
                        <span className="music-icon">🎵</span>
                        <span className="artist-initial">
                          {(song.artistName || 'E')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <button 
                      className="play-overlay-btn"
                      onClick={() => handlePlay(song)}
                    >
                      {playingSong?.id === song._id && playingSong?.isPlaying ? '⏸️' : '▶️'}
                    </button>

                    {/* Genre Badge */}
                    <div 
                      className="genre-badge"
                      style={{ backgroundColor: getGenreColor(song.genre) }}
                    >
                      {song.genre || 'Music'}
                    </div>

                    {/* Delete Button for Artist */}
                    {isSongOwner(song) && (
                      <button 
                        className="delete-track-btn"
                        onClick={() => setDeleteConfirm(song._id)}
                        title="Delete track"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="song-info-premium">
                  <h3 className="song-title-premium" title={song.title}>
                    {song.title || 'Untitled Track'}
                  </h3>
                  <p className="song-artist-premium">
                    by <span className="artist-name">{song.artistName || 'Exclusive Solo'}</span>
                  </p>
                  
                  <div className="song-meta">
                    <span className="meta-item">
                      ⏱️ {formatDuration(song.duration)}
                    </span>
                    <span className="meta-item">
                      💾 {formatFileSize(song.fileSize)}
                    </span>
                    <span className="meta-item">
                      📅 {song.uploadDate ? new Date(song.uploadDate).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <div className="song-stats-premium">
                    <div className="stat">
                      <span className="stat-icon">▶️</span>
                      <span className="stat-value">{song.plays || 0}</span>
                      <span className="stat-label">Plays</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">⬇️</span>
                      <span className="stat-value">{song.downloads || 0}</span>
                      <span className="stat-label">Downloads</span>
                    </div>
                  </div>

                  <div className="song-actions-premium">
                    <button 
                      className={`play-btn-premium ${playingSong?.id === song._id ? (playingSong?.isPlaying ? 'playing' : 'paused') : ''}`}
                      onClick={() => handlePlay(song)}
                    >
                      {playingSong?.id === song._id ? 
                        (playingSong?.isPlaying ? '⏸️ Pause' : '▶️ Resume') : 
                        '▶️ Play Now'
                      }
                    </button>
                    <button 
                      className="download-btn-premium"
                      onClick={() => handleDownload(song)}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;