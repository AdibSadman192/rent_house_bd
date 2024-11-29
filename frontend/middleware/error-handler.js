import React from 'react';
import { toast } from 'react-toastify';

// Global error handler for frontend
export const handleError = (error, customMessage = null) => {
  // Check if error is an axios error or a standard error
  const errorMessage = customMessage || 
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred';

  // Log error for debugging
  console.error('Global Error Handler:', error);

  // Display toast notification
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  // Additional error tracking or reporting can be added here
  // For example, sending error to a monitoring service
};

// Error boundary for React components
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-6">
              We're sorry, but an unexpected error occurred.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Async error wrapper for consistent error handling
export const withErrorHandling = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export default {
  handleError,
  ErrorBoundary,
  withErrorHandling
};
