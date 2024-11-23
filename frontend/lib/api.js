import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updatePassword: (data) => api.put('/auth/update-password', data)
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  getActivity: () => api.get('/users/activity'),
  uploadAvatar: (formData) => api.post('/users/avatar', formData)
};

// Property APIs
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getAnalytics: (id) => api.get(`/properties/${id}/analytics`),
  getFeatured: () => api.get('/properties/featured'),
  search: (params) => api.get('/properties/search', { params }),
  uploadImages: (id, formData) => api.post(`/properties/${id}/images`, formData)
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
  getHistory: () => api.get('/bookings/history')
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getChatbotAnalytics: (params) => api.get('/admin/chatbot/analytics', { params }),
  getPropertyAnalytics: () => api.get('/admin/properties/analytics'),
  getSystemStats: () => api.get('/admin/system/stats'),
  getLogs: (params) => api.get('/admin/logs', { params })
};

// Chatbot APIs
export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
  getHistory: () => api.get('/chatbot/history'),
  feedback: (messageId, feedback) => api.post(`/chatbot/feedback/${messageId}`, feedback)
};

// Analytics APIs
export const analyticsAPI = {
  getPropertyViews: (id) => api.get(`/analytics/properties/${id}/views`),
  trackEvent: (event) => api.post('/analytics/events', event),
  getMarketInsights: (area) => api.get('/analytics/market', { params: { area } }),
  getUserStats: () => api.get('/analytics/users/stats')
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (preferences) => api.put('/notifications/preferences', preferences)
};

// Search APIs
export const searchAPI = {
  properties: (query) => api.get('/search/properties', { params: { query } }),
  users: (query) => api.get('/search/users', { params: { query } }),
  global: (query) => api.get('/search', { params: { query } })
};

// Notification Methods
export const notificationMethods = {
  getNotificationPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUnreadNotificationCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/notifications/read/all');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  clearAllNotifications: async () => {
    const response = await api.delete('/notifications');
    return response.data;
  }
};

// Export the base instance as well
export default api;
