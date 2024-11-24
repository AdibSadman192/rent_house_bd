class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
    this.validationErrors = {};
  }

  addError(field, message) {
    this.validationErrors[field] = message;
    return this;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class DuplicateError extends AppError {
  constructor(message = 'Duplicate entry') {
    super(message, 409);
    this.name = 'DuplicateError';
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 503);
    this.name = 'NetworkError';
  }
}

class FileOperationError extends AppError {
  constructor(message = 'File operation failed') {
    super(message, 500);
    this.name = 'FileOperationError';
  }
}

class ExternalAPIError extends AppError {
  constructor(message = 'External service error') {
    super(message, 502);
    this.name = 'ExternalAPIError';
  }
}

// Error handler for async functions
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Format Mongoose validation errors
const formatMongooseError = (err) => {
  const error = new ValidationError('Validation failed');
  
  if (err.errors) {
    Object.keys(err.errors).forEach((field) => {
      error.addError(field, err.errors[field].message);
    });
  }
  
  return error;
};

// Format JWT errors
const formatJWTError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  return err;
};

// Format Multer errors
const formatMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ValidationError('File size too large');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new ValidationError('Too many files');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new ValidationError('Invalid file type');
  }
  return err;
};

// Format MongoDB errors
const formatMongoError = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new DuplicateError(
      `A record with this ${field} already exists`
    );
  }
  return err;
};

// Format network errors
const formatNetworkError = (err) => {
  if (err.code === 'ETIMEDOUT') {
    return new NetworkError('Request timed out');
  }
  if (err.code === 'ECONNREFUSED') {
    return new NetworkError('Connection refused');
  }
  return err;
};

// Format file operation errors
const formatFileError = (err) => {
  if (err.code === 'ENOENT') {
    return new FileOperationError('File not found');
  }
  if (err.code === 'EACCES') {
    return new FileOperationError('Permission denied');
  }
  if (err.code === 'ENOSPC') {
    return new FileOperationError('No space left on device');
  }
  return err;
};

// Format external API errors
const formatExternalAPIError = (err) => {
  if (err.response) {
    return new ExternalAPIError(
      `External API error: ${err.response.status} - ${err.response.statusText}`
    );
  }
  if (err.request) {
    return new ExternalAPIError('No response from external API');
  }
  return err;
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateError,
  RateLimitError,
  NetworkError,
  FileOperationError,
  ExternalAPIError,
  catchAsync,
  formatMongooseError,
  formatJWTError,
  formatMulterError,
  formatMongoError,
  formatNetworkError,
  formatFileError,
  formatExternalAPIError,
};
