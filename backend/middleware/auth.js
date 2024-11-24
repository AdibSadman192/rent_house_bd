const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

// Protect routes middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;
  let refreshToken;

  // Check if tokens exist in headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    refreshToken = req.headers['x-refresh-token'];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify access token
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
    // Handle token expiration
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Generate new access token
        const { accessToken: newToken } = generateTokens(decoded.id);
        
        // Set new token in response header
        res.setHeader('X-New-Token', newToken);
        
        // Get user and continue
        const user = await User.findById(decoded.id).select('-password');
        if (!user || user.status !== 'active') {
          res.status(401);
          throw new Error('User not found or inactive');
        }
        
        req.user = user;
        next();
      } catch (refreshError) {
        res.status(401);
        throw new Error('Session expired. Please login again.');
      }
    } else {
      res.status(401);
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else {
        throw error;
      }
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

    // Add role check timestamp
    req.roleCheckTimestamp = Date.now();
    next();
  };
};

// Check permissions for specific actions
const checkPermission = (action) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(500);
      throw new Error('User not found in request. Protect middleware must be used first.');
    }

    // Super admin has all permissions
    if (req.user.role === 'super-admin') {
      next();
      return;
    }

    // Admin permissions
    if (req.user.role === 'admin') {
      const adminPermissions = [
        'view_dashboard',
        'manage_properties',
        'manage_users',
        'view_analytics'
      ];
      
      if (adminPermissions.includes(action)) {
        next();
        return;
      }
    }

    // Regular user permissions
    const userPermissions = [
      'view_properties',
      'create_booking',
      'manage_profile'
    ];

    if (userPermissions.includes(action)) {
      next();
      return;
    }

    res.status(403);
    throw new Error('You do not have permission to perform this action');
  };
};

module.exports = { 
  protect, 
  authorize, 
  checkPermission,
  generateTokens 
};
