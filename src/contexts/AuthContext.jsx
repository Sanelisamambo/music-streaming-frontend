import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';
import { songAPI } from '../services/songAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start - FIXED VERSION
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Verify token with backend and get real user data
          const response = await fetch('https://music-platform-backend-qru3.onrender.com/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            // Token is invalid, remove it
            removeAuthToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setAuthToken(response.token);
      setUser(response.data.user); // Set real user data from backend
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    setAuthToken(response.token);
    
    // Ensure we have the complete user object with _id
    console.log('Login response user:', response.data.user);
    setUser(response.data.user);
    return response;
  } catch (error) {
    throw error;
  }
};

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const uploadSong = async (formData) => {
    try {
      const response = await songAPI.uploadSong(formData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAllSongs = async () => {
    try {
      const songs = await songAPI.getAllSongs();
      return songs;
    } catch (error) {
      console.error('Error in getAllSongs:', error);
      return [];
    }
  };

  const deleteSong = async (songId) => {
    try {
      const response = await songAPI.deleteSong(songId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    uploadSong,
    getAllSongs,
    deleteSong,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};