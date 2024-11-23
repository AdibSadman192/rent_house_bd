const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Protect routes middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403);
      throw new Error('Your account is not active. Please contact support.');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else {
      throw error;
    }
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(500);
      throw new Error('User not found in request. Protect middleware must be used first.');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorize };
