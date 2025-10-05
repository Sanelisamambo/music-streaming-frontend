import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? JSON.stringify(user) : 'None'}</div>
      <div>Role: {user?.role || 'None'}</div>
    </div>
  );
};

export default DebugInfo;