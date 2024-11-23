import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/properties', '/posts'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        if (!PUBLIC_ROUTES.includes(router.pathname)) {
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify token with backend
        const response = await axios.get('/auth/verify');
        if (response.data.valid) {
          setUser(response.data.user);
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const { data } = await axios.post('/auth/login', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  const handleRegister = async (formData) => {
    try {
      const { data } = await axios.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put('/auth/profile', profileData);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateProfile,
    isAuthenticated: !!user,
    checkUser
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

export default AuthContext;
