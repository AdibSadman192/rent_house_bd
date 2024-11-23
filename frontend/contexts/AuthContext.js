import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const ROLE_REDIRECTS = {
  'super-admin': '/super-admin/dashboard',
  admin: '/admin/dashboard',
  renter: '/renter/dashboard',
  user: '/dashboard'
};

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // If no token and not on a public route, redirect to login
      if (!token && !PUBLIC_ROUTES.includes(router.pathname)) {
        router.push('/login');
        setLoading(false);
        return;
      }
      
      // If no token but on a public route, just continue
      if (!token && PUBLIC_ROUTES.includes(router.pathname)) {
        setLoading(false);
        return;
      }

      // If there's a token, verify it
      if (token) {
        try {
          const response = await axios.get('/api/auth/verify');
          const userData = response.data.data;
          setUser(userData);
          
          // If on login/register page with valid token, redirect to appropriate dashboard
          if (['/login', '/register'].includes(router.pathname)) {
            const redirectPath = ROLE_REDIRECTS[userData.role] || '/dashboard';
            router.push(redirectPath);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          if (!PUBLIC_ROUTES.includes(router.pathname)) {
            router.push('/login');
          }
        }
      }
    } catch (error) {
      console.error('Session verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      const redirectPath = ROLE_REDIRECTS[userData.role] || '/dashboard';
      router.push(redirectPath);
      
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const logout = async (silent = false) => {
    try {
      if (localStorage.getItem('token')) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
      if (!silent) {
        toast.success('Successfully logged out');
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user: newUser } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(newUser);
      
      router.push('/dashboard');
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
