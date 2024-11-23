import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

if (!baseURL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

// Create axios instance with config
const instance = axios.create({
  baseURL: `${baseURL}/api`, // Add back the /api prefix
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage only on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          // Clear local storage
          localStorage.clear();
          // Redirect to login page if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      
      // Extract error message from response
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'Something went wrong';
                     
      return Promise.reject({ message });
    }
    return Promise.reject({ message: 'Network error. Please check your connection.' });
  }
);

export default instance;
