// Error types for better categorization and handling
export const ErrorTypes = {
  AUTH: {
    INVALID_CREDENTIALS: 'auth/invalid-credentials',
    TOKEN_EXPIRED: 'auth/token-expired',
    INVALID_TOKEN: 'auth/invalid-token',
    SOCIAL_LOGIN_FAILED: 'auth/social-login-failed',
    PERMISSION_DENIED: 'auth/permission-denied',
    SESSION_EXPIRED: 'auth/session-expired',
    NETWORK_ERROR: 'auth/network-error',
    USER_NOT_FOUND: 'auth/user-not-found',
    DATABASE_ERROR: 'auth/database-error'
  }
};

// Error tracking function
export const trackError = async (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      type: error.type || 'unknown',
      code: error.code
    },
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      ...context
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error tracked:', errorLog);
  }

  try {
    // Store error in localStorage for analysis
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errors.push(errorLog);
    // Keep only last 50 errors
    if (errors.length > 50) errors.shift();
    localStorage.setItem('error_logs', JSON.stringify(errors));

    // In production, you might want to send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your API endpoint
      await fetch('/api/error-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      });
    }
  } catch (e) {
    console.error('Error while tracking error:', e);
  }

  return errorLog;
};

// Custom error class for authentication
export class AuthError extends Error {
  constructor(type, message, code = null) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.code = code;
  }
}

// Function to format error messages for users
export const formatErrorMessage = (error) => {
  const errorMessages = {
    [ErrorTypes.AUTH.INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
    [ErrorTypes.AUTH.TOKEN_EXPIRED]: 'Your session has expired. Please login again.',
    [ErrorTypes.AUTH.INVALID_TOKEN]: 'Authentication failed. Please login again.',
    [ErrorTypes.AUTH.SOCIAL_LOGIN_FAILED]: 'Social login failed. Please try again.',
    [ErrorTypes.AUTH.PERMISSION_DENIED]: 'Permission denied. Please check your account permissions.',
    [ErrorTypes.AUTH.SESSION_EXPIRED]: 'Your session has expired. Please login again.',
    [ErrorTypes.AUTH.NETWORK_ERROR]: 'Network error. Please check your internet connection.',
    [ErrorTypes.AUTH.USER_NOT_FOUND]: 'User not found. Please check your credentials.',
    [ErrorTypes.AUTH.DATABASE_ERROR]: 'Server error. Please try again later.'
  };

  return errorMessages[error.type] || error.message || 'An unexpected error occurred. Please try again.';
};
