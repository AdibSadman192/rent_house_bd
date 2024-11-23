const {
  formatMongooseError,
  formatJWTError,
  formatMulterError,
  formatMongoError,
} = require('../utils/errorHandler');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? req.user.id : 'Not authenticated'
  });

  // Format specific errors
  let error = err;
  
  if (err.name === 'ValidationError') {
    error = formatMongooseError(err);
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = formatJWTError(err);
  }
  if (err.name === 'MulterError') {
    error = formatMulterError(err);
  }
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    error = formatMongoError(err);
  }

  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send error response
  res.json({
    success: false,
    status: error.status || 'error',
    message: error.message || 'Internal server error',
    ...(error.validationErrors && { errors: error.validationErrors }),
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};

// Handle 404 errors for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handle uncaught exceptions
const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥');
    console.error(err.name, err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });
};

// Handle unhandled promise rejections
const handleUnhandledRejections = (server) => {
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err.name, err.message);
    console.error('Stack:', err.stack);
    server.close(() => {
      process.exit(1);
    });
  });
};

module.exports = {
  errorHandler,
  notFound,
  handleUncaughtExceptions,
  handleUnhandledRejections,
};
