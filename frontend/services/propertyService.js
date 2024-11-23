import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const propertyService = {
  // Get featured properties
  getFeaturedProperties: async (count = 8) => {
    try {
      const response = await api.get(`/properties/featured?count=${count}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search properties
  searchProperties: async (params) => {
    try {
      const response = await api.get('/properties/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new property listing
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get property types
  getPropertyTypes: async () => {
    try {
      const response = await api.get('/properties/types');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get locations (divisions and areas)
  getLocations: async () => {
    try {
      const response = await api.get('/properties/locations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get amenities
  getAmenities: async () => {
    try {
      const response = await api.get('/properties/amenities');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get price ranges
  getPriceRanges: async () => {
    try {
      const response = await api.get('/properties/price-ranges');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload property images
  uploadImages: async (propertyId, formData) => {
    try {
      const response = await api.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's favorite properties
  getFavorites: async () => {
    try {
      const response = await api.get('/properties/favorites');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add property to favorites
  addToFavorites: async (propertyId) => {
    try {
      const response = await api.post(`/properties/${propertyId}/favorite`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove property from favorites
  removeFromFavorites: async (propertyId) => {
    try {
      const response = await api.delete(`/properties/${propertyId}/favorite`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default propertyService;
