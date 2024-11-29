import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your internet connection.');
    }

    // Handle token expiration
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { token });
        localStorage.setItem('token', response.data.token);
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // Handle other error statuses
    const errorMap = {
      400: 'Bad Request',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error'
    };

    const errorMessage = errorMap[error.response.status] || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Utility methods for common operations
const apiService = {
  // Authentication endpoints
  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  refreshToken() {
    return api.post('/auth/refresh', { 
      token: localStorage.getItem('refreshToken') 
    });
  },

  logout() {
    return api.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      });
  },

  // Generic CRUD operations
  getAll(endpoint, params = {}) {
    return api.get(endpoint, { params });
  },

  getById(endpoint, id) {
    return api.get(`${endpoint}/${id}`);
  },

  create(endpoint, data) {
    return api.post(endpoint, data);
  },

  update(endpoint, id, data) {
    return api.put(`${endpoint}/${id}`, data);
  },

  patch(endpoint, id, data) {
    return api.patch(`${endpoint}/${id}`, data);
  },

  delete(endpoint, id) {
    return api.delete(`${endpoint}/${id}`);
  },

  // File upload utility
  uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);

    // Append additional data if provided
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Batch operations
  batchCreate(endpoint, items) {
    return api.post(`${endpoint}/batch`, { items });
  },

  batchUpdate(endpoint, items) {
    return api.put(`${endpoint}/batch`, { items });
  },

  // Search and filter
  search(endpoint, query, params = {}) {
    return api.get(endpoint, {
      params: {
        search: query,
        ...params
      }
    });
  }
};

export { api, apiService };
export default apiService;
