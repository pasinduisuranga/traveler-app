import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.message || 'An error occurred';
    const errors = error.response?.data?.errors || [];
    
    return Promise.reject({
      message: errorMessage,
      errors,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Experiences API
export const experiencesAPI = {
  getAll: (params = {}) => api.get('/experiences', { params }),
  getById: (id) => api.get(`/experiences/${id}`),
  search: (searchParams) => api.get('/experiences', { params: searchParams }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
  cancel: (id) => api.patch(`/bookings/${id}`, { status: 'cancelled' }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// Providers API
export const providersAPI = {
  getAll: () => api.get('/providers'),
  register: (providerData) => api.post('/providers/register', providerData),
  getDashboard: (id) => api.get(`/providers/${id}/dashboard`),
  getExperiences: (id) => api.get(`/providers/${id}/experiences`),
  createExperience: (id, experienceData) => api.post(`/providers/${id}/experiences`, experienceData),
  updateExperience: (providerId, experienceId, experienceData) => 
    api.put(`/providers/${providerId}/experiences/${experienceId}`, experienceData),
  getReviews: (id) => api.get(`/providers/${id}/reviews`),
  getAnalytics: (id, range) => api.get(`/providers/${id}/analytics`, { params: { range } }),
  getPayments: (id) => api.get(`/providers/${id}/payments`),
  getConversations: (id) => api.get(`/providers/${id}/conversations`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health', { baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' }),
};

// Utility functions
export const apiUtils = {
  // Check if API is available
  isApiAvailable: async () => {
    try {
      await healthAPI.check();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Handle API errors consistently
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      return 'Your session has expired. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.status === 429) {
      return 'Too many requests. Please try again later.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else if (error.errors && error.errors.length > 0) {
      return error.errors.map(err => err.message).join(', ');
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  },

  // Format API response
  formatResponse: (response) => {
    return {
      success: response.data?.success !== false,
      data: response.data?.data || response.data,
      message: response.data?.message,
      count: response.data?.count
    };
  }
};

export default api;