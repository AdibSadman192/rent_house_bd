const User = require('../models/User');

// Generic role check middleware
const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}.` 
      });
    }

    next();
  } catch (error) {
    console.error('Role check error:', error);
    res.status(500).json({ message: 'Server error during role check' });
  }
};

// Role-specific middleware
exports.isAdmin = checkRole(['admin', 'super_admin']);
exports.isOwner = checkRole(['owner', 'admin', 'super_admin']);
exports.isSuperAdmin = checkRole(['super_admin']);
exports.checkRole = checkRole; // Export for custom role checks
