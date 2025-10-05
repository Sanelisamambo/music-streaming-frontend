import { getAuthToken } from './api';

const API_URL = 'https://music-platform-backend-qru3.onrender.com';

// Song API functions
export const songAPI = {
  // Upload song with file
  uploadSong: async (formData) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/songs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Get all songs
  getAllSongs: async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      return data.data.songs || [];
    } catch (error) {
      console.error('Error fetching songs:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Delete song
  deleteSong: async (songId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/songs/${songId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};