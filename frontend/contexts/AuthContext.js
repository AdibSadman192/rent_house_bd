import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/', '/about', '/contact'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await axios.get('/api/auth/me');
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  const checkPermission = (requiredRole) => {
    if (!user) return false;
    const roles = {
      user: 0,
      renter: 1,
      admin: 2,
      super_admin: 3
    };
    return roles[user.role] >= roles[requiredRole];
  };

  // Protect routes
  useEffect(() => {
    if (!initialized) return;

    const path = router.pathname;
    if (!user && !PUBLIC_ROUTES.includes(path)) {
      router.push(`/login?redirect=${path}`);
    }
  }, [initialized, user, router.pathname]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
