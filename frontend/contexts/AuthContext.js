import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import SessionManager from '../services/sessionManager';

const AuthContext = createContext({});

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password', '/', '/about', '/contact', '/properties', '/faq', '/help', '/blog'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount and setup session monitoring
  useEffect(() => {
    checkAuth();
    const interval = setInterval(monitorSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Route protection
  useEffect(() => {
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
      if (!user && !isPublicRoute) {
        router.push('/auth/login');
      }
    }
  }, [loading, user, router.pathname]);

  // Monitor session status
  const monitorSession = async () => {
    try {
      const session = await SessionManager.validateAndRefreshSession();
      setUser(session.user);
    } catch (error) {
      console.error('Session validation failed:', error);
      logout(); 
    }
  };

  const checkAuth = async () => {
    try {
      const session = await SessionManager.validateAndRefreshSession();
      setUser(session.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.token && data.refreshToken) {
        SessionManager.saveSession(data.token, data.refreshToken, data.user);
        setUser(data.user);
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    SessionManager.clearSession();
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
