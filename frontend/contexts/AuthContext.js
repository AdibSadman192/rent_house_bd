import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/router';
import { useSession } from '@/hooks/useSession';

const AuthContext = createContext({});

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/', '/about', '/contact'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const session = useSession();

  // Set up axios interceptor for token
  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor for 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            const refreshed = await refreshToken();
            if (refreshed) {
              // Retry the original request
              const config = error.config;
              config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
              return axios(config);
            } else {
              // If refresh failed, logout
              await handleLogout(true);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            await handleLogout(true);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      delete axios.defaults.headers.common['Authorization'];
      axios.interceptors.response.eject(interceptor);
    };
  }, [router, session]);

  // Check user authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          if (!PUBLIC_ROUTES.includes(router.pathname)) {
            await handleLogout(true);
          }
          setLoading(false);
          setInitialized(true);
          return;
        }

        try {
          // Always verify token with backend
          const { data } = await axios.get('/auth/verify-session', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (data.valid) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            throw new Error('Invalid session');
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          await handleLogout(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await handleLogout(true);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkUser();
  }, [router.pathname]);

  const refreshToken = async () => {
    try {
      const { data } = await axios.post('/auth/refresh-token', {}, {
        headers: { 'x-refresh-token': localStorage.getItem('refreshToken') }
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/auth/login', credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);

      toast.success('Successfully logged in!');
      
      // Redirect based on role
      if (data.user.role === 'admin' || data.user.role === 'super-admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const handleLogout = async (silent = false) => {
    try {
      // Call backend logout endpoint
      await axios.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      
      if (!silent) {
        toast.success('Logged out successfully');
      }
      
      if (!PUBLIC_ROUTES.includes(router.pathname)) {
        router.push('/login');
      }
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const { data } = await axios.put('/auth/update', updatedData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const checkPermission = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'super-admin') return user.role === 'super-admin';
    if (requiredRole === 'admin') return ['admin', 'super-admin'].includes(user.role);
    return true;
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    handleLogout,
    updateUser,
    checkPermission,
    refreshToken
  };

  if (!initialized) {
    return null;
  }

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
