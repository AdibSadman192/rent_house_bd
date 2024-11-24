const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/async');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeProperties = await Property.countDocuments({ status: 'active' });
  const pendingProperties = await Property.find({ status: 'pending' })
    .populate('owner', 'name email')
    .select('title location status owner');
  const totalBookings = await Booking.countDocuments();

  const stats = {
    totalUsers,
    activeProperties,
    pendingApprovals: pendingProperties.length,
    totalBookings
  };

  res.json({
    success: true,
    stats,
    pendingProperties
  });
});

// @desc    Get property analytics
// @route   GET /api/admin/analytics/properties
// @access  Private/Admin
exports.getPropertyAnalytics = asyncHandler(async (req, res) => {
  const monthlyProperties = await Property.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  const propertyTypes = await Property.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    monthlyProperties,
    propertyTypes
  });
});

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const monthlyUsers = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  const userRoles = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    monthlyUsers,
    userRoles
  });
});

// @desc    Get system statistics
// @route   GET /api/admin/system-stats
// @access  Private/Admin
exports.getSystemStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalBookings = await Booking.countDocuments();
  
  const activeUsers = await User.countDocuments({ status: 'active' });
  const pendingProperties = await Property.countDocuments({ status: 'pending' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });

  res.json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      properties: {
        total: totalProperties,
        pending: pendingProperties
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings
      }
    }
  });
});

// @desc    Approve or reject property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private/Admin
exports.approveProperty = asyncHandler(async (req, res) => {
  const { approved } = req.body;
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  property.status = approved ? 'active' : 'rejected';
  await property.save();

  res.json({
    success: true,
    data: property
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent updating super admin
  if (user.role === 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'Cannot update super admin status'
    });
  }

  user.status = status;
  await user.save();

  res.json({
    success: true,
    data: user
  });
});
