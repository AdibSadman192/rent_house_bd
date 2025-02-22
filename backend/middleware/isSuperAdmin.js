const User = require('../models/User');

const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({
        message: 'Access denied. Super admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in super admin middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = isSuperAdmin;
