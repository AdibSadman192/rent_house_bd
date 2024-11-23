import axios from 'axios';

const baseURL = 'http://localhost:5000';

// Create axios instance with config
const instance = axios.create({
  baseURL: `${baseURL}/api`, 
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
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.'
      });
    }

    // Handle specific error responses
    const errorMessage = error.response.data?.message || 'Something went wrong';
    return Promise.reject({ message: errorMessage });
  }
);

export default instance;
