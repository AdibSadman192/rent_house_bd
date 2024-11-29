import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import apiService from '@/services/api';
import { handleError } from '@/middleware/error-handler';

// Define user roles
export const UserRoles = {
  RENTER: 'renter',
  OWNER: 'owner',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Create AuthContext
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          // Verify token and get user details
          const response = await apiService.get('/auth/me');
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          handleLogout();
        }
      }
    };

    initializeAuth();
  }, []);

  // Token refresh mechanism
  const refreshToken = async () => {
    try {
      const response = await apiService.refreshToken();
      const { token, user } = response.data;
      
      // Update cookies and user state
      Cookies.set('auth_token', token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production' 
      });
      setUser(user);
      return token;
    } catch (error) {
      handleLogout();
      throw error;
    }
  };

  // Login method
  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      const { token, user } = response.data;

      // Set authentication cookies
      Cookies.set('auth_token', token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production' 
      });
      Cookies.set('user_role', user.role, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production' 
      });

      // Update user state
      setUser(user);
      setIsAuthenticated(true);

      // Redirect based on user role
      switch (user.role) {
        case UserRoles.ADMIN:
          router.push('/admin/dashboard');
          break;
        case UserRoles.OWNER:
          router.push('/dashboard/properties');
          break;
        case UserRoles.RENTER:
          router.push('/dashboard/bookings');
          break;
        default:
          router.push('/dashboard');
      }

      return user;
    } catch (error) {
      handleError(error, 'Login failed');
      throw error;
    }
  };

  // Logout method
  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication-related cookies
      Cookies.remove('auth_token');
      Cookies.remove('user_role');
      
      // Reset user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      router.push('/auth/login');
    }
  };

  // Update user method
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    return Array.isArray(roles) 
      ? roles.includes(user.role)
      : user.role === roles;
  };

  // Provide context value
  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    refreshToken,
    updateUser,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
