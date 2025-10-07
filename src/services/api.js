const API_URL = 'https://music-platform-backend-qru3.onrender.com/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if we got a response at all
    if (!response) {
      throw new Error('Network error: Could not connect to server');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    return data;
  } catch (error) {
    // More specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
       throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Store token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};