import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  return api.post('/auth/refresh', { token });
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export default api;
