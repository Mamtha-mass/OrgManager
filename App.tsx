import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AuthState } from './types';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setAuth({
        isAuthenticated: true,
        user: { id: 'admin-1', email: 'admin@example.com', name: 'Super Admin', role: 'super_admin' },
        token: savedToken
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false, user: null, token: null });
  };

  const handleLogin = (newAuth: AuthState) => {
    if (newAuth.token) {
      localStorage.setItem('token', newAuth.token);
    }
    setAuth(newAuth);
  };

  return (
    <HashRouter>
      {auth.isAuthenticated ? (
        <Dashboard auth={auth} onLogout={handleLogout} />
      ) : (
        <Login setAuth={handleLogin} />
      )}
    </HashRouter>
  );
}

export default App;