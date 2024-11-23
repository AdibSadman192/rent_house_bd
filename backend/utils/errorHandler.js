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

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateError,
  catchAsync,
  formatMongooseError,
  formatJWTError,
  formatMulterError,
  formatMongoError,
};
