import { toast } from 'react-toastify';

// Error message mapping
const errorMessages = {
  // Authentication errors
  'Invalid credentials': 'Email or password is incorrect',
  'Token expired': 'Your session has expired. Please login again',
  'Authentication failed': 'Please login to continue',
  
  // Authorization errors
  'Access denied': 'You do not have permission to perform this action',
  'Insufficient permissions': 'Your role does not have access to this feature',
  
  // Validation errors
  'Validation failed': 'Please check your input and try again',
  'Invalid input': 'Please provide valid information',
  
  // Resource errors
  'Not found': 'The requested resource was not found',
  'Already exists': 'This record already exists',
  
  // File upload errors
  'File too large': 'File size exceeds the maximum limit',
  'Invalid file type': 'This file type is not supported',
  
  // Network errors
  'Network Error': 'Unable to connect to server. Please check your internet connection',
  'Request timeout': 'Request took too long to complete. Please try again',
  
  // Default error
  'default': 'An unexpected error occurred. Please try again',
};

// Format error message based on error type and response
export const formatErrorMessage = (error) => {
  if (!error) return errorMessages.default;

  // Handle axios error response
  if (error.response) {
    const { data, status } = error.response;
    
    // Handle validation errors
    if (status === 400 && data.errors) {
      return Object.values(data.errors).join(', ');
    }
    
    // Handle known error messages
    if (data.message && errorMessages[data.message]) {
      return errorMessages[data.message];
    }
    
    // Return server error message if available
    return data.message || errorMessages.default;
  }

  // Handle network errors
  if (error.message === 'Network Error') {
    return errorMessages['Network Error'];
  }

  // Handle timeout
  if (error.code === 'ECONNABORTED') {
    return errorMessages['Request timeout'];
  }

  // Return original error message or default
  return error.message || errorMessages.default;
};

// Show error toast with formatted message
export const showError = (error) => {
  const message = formatErrorMessage(error);
  toast.error(message);
};

// Handle API errors consistently
export const handleApiError = (error, customHandler) => {
  // Log error for debugging
  console.error('API Error:', error);

  // Handle session expiry
  if (error.response?.status === 401) {
    // Clear auth state and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return;
  }

  // Call custom handler if provided
  if (customHandler) {
    customHandler(error);
    return;
  }

  // Show error toast by default
  showError(error);
};

// Axios error interceptor
export const setupAxiosErrorInterceptor = (axios) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );
};

// Form error handler for Formik
export const handleFormError = (error, setFieldError) => {
  if (error.response?.data?.errors) {
    // Set field-specific errors
    Object.entries(error.response.data.errors).forEach(([field, message]) => {
      setFieldError(field, message);
    });
  } else {
    // Show general error
    showError(error);
  }
};

// Validate file size and type
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  return true;
};
