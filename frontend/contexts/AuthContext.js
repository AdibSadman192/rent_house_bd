import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SessionManager from '../services/sessionManager';

const AuthContext = createContext({});

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/owner',
  '/properties/create',
  '/properties/edit',
  '/bookings',
  '/messages',
  '/favorites'
];

// Routes that require specific roles
const ROLE_PROTECTED_ROUTES = {
  '/admin': ['admin', 'super_admin'],
  '/owner': ['owner', 'admin', 'super_admin']
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount and setup session monitoring
  useEffect(() => {
    checkAuth();
    const interval = setInterval(monitorSession, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Route protection
  useEffect(() => {
    if (!loading) {
      // Check if current route is protected
      const isProtectedRoute = PROTECTED_ROUTES.some(route => router.pathname.startsWith(route));
      
      if (isProtectedRoute) {
        if (!user) {
          // Save the intended destination
          SessionManager.saveIntendedRoute(router.pathname);
          router.push('/auth/login');
          return;
        }

        // Check role-based access
        for (const [route, roles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
          if (router.pathname.startsWith(route) && !roles.includes(user.role)) {
            router.push('/dashboard');
            return;
          }
        }
      }
    }
  }, [loading, user, router.pathname]);

  // Monitor session status
  const monitorSession = async () => {
    try {
      const session = await SessionManager.validateAndRefreshSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      // Only logout if token refresh fails and we're on a protected route
      const isProtectedRoute = PROTECTED_ROUTES.some(route => router.pathname.startsWith(route));
      if (isProtectedRoute) {
        console.error('Session validation failed:', error);
        logout();
      }
    }
  };

  const checkAuth = async () => {
    try {
      const session = await SessionManager.validateAndRefreshSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for cookies
      });

      const data = await response.json();
      console.log('AuthContext: Login response:', data);

      if (!response.ok) {
        console.log('AuthContext: Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.token && data.user) {
        console.log('AuthContext: Login successful, saving session...');
        
        try {
          // Save session first
          await SessionManager.saveSession(data.token, data.refreshToken, data.user);
          console.log('AuthContext: Session saved successfully');
          
          // Then update user state
          setUser(data.user);
          console.log('AuthContext: User state updated');
          
          return { 
            success: true,
            user: data.user
          };
        } catch (error) {
          console.error('AuthContext: Error saving session:', error);
          throw new Error('Failed to save session');
        }
      }

      console.log('AuthContext: Invalid server response');
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during login'
      };
    }
  };

  // Helper to get default route based on role
  const getDefaultRoute = (role) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return '/admin/dashboard';
      case 'owner':
        return '/owner/dashboard';
      default:
        return '/dashboard';
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      SessionManager.clearSession();
      setUser(null);
      router.push('/');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
