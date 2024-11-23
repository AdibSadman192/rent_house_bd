const User = require('../models/User');

const trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      // Update user's last active timestamp
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { lastActive: new Date() },
          $push: {
            activityLog: {
              action: req.method,
              path: req.path,
              timestamp: new Date(),
              ip: req.ip,
              userAgent: req.get('user-agent')
            }
          }
        },
        { new: true }
      );
    }
    next();
  } catch (error) {
    console.error('Error tracking user activity:', error);
    next(); // Continue even if tracking fails
  }
};

module.exports = trackActivity;
