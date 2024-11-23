import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

// Create axios instance with config
const instance = axios.create({
  baseURL: baseURL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return config;
    }
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) errors
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Use window.location for hard redirect to avoid Next.js routing issues
      const loginPath = '/login';
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
