import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class PropertyService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Get all locations
  async getLocations() {
    try {
      // TODO: Replace with actual API call
      return [
        { id: 'gulshan', name: 'Gulshan' },
        { id: 'banani', name: 'Banani' },
        { id: 'dhanmondi', name: 'Dhanmondi' },
        { id: 'uttara', name: 'Uttara' },
        { id: 'mirpur', name: 'Mirpur' },
        { id: 'mohammadpur', name: 'Mohammadpur' },
      ];
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  // Get all property types
  async getPropertyTypes() {
    try {
      // TODO: Replace with actual API call
      return [
        { id: 'apartment', name: 'Apartment' },
        { id: 'house', name: 'House' },
        { id: 'villa', name: 'Villa' },
        { id: 'studio', name: 'Studio' },
        { id: 'duplex', name: 'Duplex' },
      ];
    } catch (error) {
      console.error('Error fetching property types:', error);
      throw error;
    }
  }

  // Get featured properties
  async getFeaturedProperties() {
    try {
      // TODO: Replace with actual API call
      return [
        {
          id: 1,
          title: 'Modern Apartment in Gulshan',
          description: 'Luxurious 3-bedroom apartment with modern amenities',
          location: 'Gulshan, Dhaka',
          price: 45000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          propertyType: 'apartment',
          features: ['Swimming Pool', 'Gym', 'Security'],
          imageUrl: '/images/property1.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Spacious Villa in Banani',
          description: 'Beautiful 4-bedroom villa with garden',
          location: 'Banani, Dhaka',
          price: 75000,
          bedrooms: 4,
          bathrooms: 3,
          area: 2500,
          propertyType: 'villa',
          features: ['Garden', 'Parking', '24/7 Security'],
          imageUrl: '/images/property2.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Cozy Studio in Dhanmondi',
          description: 'Perfect studio apartment for singles or couples',
          location: 'Dhanmondi, Dhaka',
          price: 25000,
          bedrooms: 1,
          bathrooms: 1,
          area: 600,
          propertyType: 'studio',
          features: ['Furnished', 'Balcony', 'WiFi'],
          imageUrl: '/images/property3.jpg',
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  }

  // Search properties with filters
  async searchProperties(filters) {
    try {
      const { location, propertyType, priceRange, bedrooms } = filters;
      // TODO: Replace with actual API call
      const response = await this.api.get('/properties/search', {
        params: {
          location,
          propertyType,
          priceRange,
          bedrooms,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  // Get property by ID
  async getPropertyById(id) {
    try {
      const response = await this.api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  // Create new property listing
  async createProperty(propertyData) {
    try {
      const response = await this.api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  // Update property listing
  async updateProperty(id, propertyData) {
    try {
      const response = await this.api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  // Delete property listing
  async deleteProperty(id) {
    try {
      await this.api.delete(`/properties/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Get user's favorite properties
  async getFavorites() {
    try {
      const response = await this.api.get('/properties/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  // Add property to favorites
  async addToFavorites(propertyId) {
    try {
      const response = await this.api.post('/properties/favorites', { propertyId });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove property from favorites
  async removeFromFavorites(propertyId) {
    try {
      await this.api.delete(`/properties/favorites/${propertyId}`);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }
}

const propertyService = new PropertyService();
export default propertyService;
