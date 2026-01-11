/**
 * API Service for One Indang App
 * Handles communication with the Express backend
 * 
 * This service is used for:
 * - Business CRUD operations
 * - Order management (stored in database)
 * - Menu data retrieval
 * 
 * Note: Authentication is still handled by Supabase directly
 */

import axios from 'axios';

// Backend API base URL
// For development with Expo, use your computer's local IP address
// Example: 'http://192.168.1.100:5000/api'
// For production, replace with your deployed backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.18.3:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed for protected routes
    // const token = await getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== BUSINESS API ====================

export const businessAPI = {
  /**
   * Get all businesses with optional filters
   * @param {Object} params - { category, search, limit, offset }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/business', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a single business by ID
   * @param {string} id - Business ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/business/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get businesses by category
   * @param {string} category - Category name
   */
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/business/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all business categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/business/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new business
   * @param {Object} businessData - Business data object
   */
  create: async (businessData) => {
    try {
      const response = await api.post('/business', businessData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a business
   * @param {string} id - Business ID
   * @param {Object} updateData - Fields to update
   */
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/business/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a business
   * @param {string} id - Business ID
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/business/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  /**
   * Get all orders (optionally filtered by user)
   * @param {Object} params - { user_id, limit, offset }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a single order by ID
   * @param {string} id - Order ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get orders for a specific user
   * @param {string} userId - User ID
   */
  getByUser: async (userId) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new order
   * @param {Object} orderData - Order data with items
   */
  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cancel an order (only if status is 'Preparing')
   * @param {string} id - Order ID
   */
  cancel: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== MENU API ====================

export const menuAPI = {
  /**
   * Get all available restaurants with menus
   */
  getRestaurants: async () => {
    try {
      const response = await api.get('/menu');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get menu for a specific restaurant
   * @param {string} restaurantName - Restaurant name
   */
  getMenu: async (restaurantName) => {
    try {
      const response = await api.get(`/menu/${encodeURIComponent(restaurantName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get menu items by category for a restaurant
   * @param {string} restaurantName - Restaurant name
   * @param {string} category - Category name
   */
  getByCategory: async (restaurantName, category) => {
    try {
      const response = await api.get(
        `/menu/${encodeURIComponent(restaurantName)}/category/${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export default api instance for custom requests
export default api;
