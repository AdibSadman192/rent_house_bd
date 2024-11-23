const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { isAdmin, auth } = require('../middleware/auth');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const Post = require('../models/Post');
const User = require('../models/User');
const Property = require('../models/Property');
const Report = require('../models/Report');
const Settings = require('../models/Settings');
const Chatbot = require('../models/Chatbot');
const { sendEmail } = require('../utils/email');

// Middleware to ensure only admins can access these routes
router.use(auth, isAdmin);

// Get enhanced admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const previousThirtyDays = new Date(thirtyDaysAgo.getTime() - (30 * 24 * 60 * 60 * 1000));

    const [
      currentStats,
      previousStats,
      propertyStats,
      userStats,
      bookingStats
    ] = await Promise.all([
      // Current period stats
      Property.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]),
      // Previous period stats for comparison
      Property.aggregate([
        { $match: { createdAt: { $gte: previousThirtyDays, $lt: thirtyDaysAgo } } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]),
      // Property statistics
      Property.aggregate([
        {
          $facet: {
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } }
            ],
            byType: [
              { $group: { _id: "$propertyType", count: { $sum: 1 } } }
            ],
            byLocation: [
              { $group: { _id: "$location.city", count: { $sum: 1 } } }
            ]
          }
        }
      ]),
      // User statistics
      User.aggregate([
        {
          $facet: {
            byRole: [
              { $group: { _id: "$role", count: { $sum: 1 } } }
            ],
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } }
            ],
            recentlyActive: [
              { $match: { lastActive: { $gte: thirtyDaysAgo } } },
              { $count: "count" }
            ]
          }
        }
      ]),
      // Booking statistics
      mongoose.model('Booking').aggregate([
        {
          $facet: {
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } }
            ],
            recent: [
              { $match: { createdAt: { $gte: thirtyDaysAgo } } },
              { $count: "count" }
            ]
          }
        }
      ])
    ]);

    const currentCount = currentStats[0]?.count || 0;
    const previousCount = previousStats[0]?.count || 0;
    const growthRate = previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100;

    res.json({
      stats: {
        properties: currentCount,
        propertyGrowth: growthRate.toFixed(1) + '%',
        users: userStats[0]?.byRole.reduce((acc, curr) => acc + curr.count, 0) || 0,
        bookings: bookingStats[0]?.recent[0]?.count || 0,
      },
      propertyStats: propertyStats[0],
      userStats: userStats[0],
      bookingStats: bookingStats[0]
    });
  } catch (error) {
    console.error('Error fetching enhanced admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
});

// Get chatbot analytics
router.get('/chatbot/analytics', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        break;
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '90d':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    }

    const previousPeriod = new Date(startDate.getTime() - (startDate.getTime() - now.getTime()));

    const [currentStats, previousStats] = await Promise.all([
      Chatbot.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalInteractions: { $sum: 1 },
            successfulInteractions: { $sum: { $cond: ["$successful", 1, 0] } },
            totalResponseTime: { $sum: "$responseTime" },
            humanHandoffs: { $sum: { $cond: ["$handedOffToHuman", 1, 0] } }
          }
        }
      ]),
      Chatbot.aggregate([
        { $match: { timestamp: { $gte: previousPeriod, $lt: startDate } } },
        {
          $group: {
            _id: null,
            totalInteractions: { $sum: 1 },
            successfulInteractions: { $sum: { $cond: ["$successful", 1, 0] } },
            totalResponseTime: { $sum: "$responseTime" },
            humanHandoffs: { $sum: { $cond: ["$handedOffToHuman", 1, 0] } }
          }
        }
      ])
    ]);

    const current = currentStats[0] || {
      totalInteractions: 0,
      successfulInteractions: 0,
      totalResponseTime: 0,
      humanHandoffs: 0
    };
    const previous = previousStats[0] || {
      totalInteractions: 0,
      successfulInteractions: 0,
      totalResponseTime: 0,
      humanHandoffs: 0
    };

    const calculateChange = (curr, prev) => {
      if (prev === 0) return '+100';
      return ((curr - prev) / prev * 100).toFixed(1);
    };

    res.json({
      totalInteractions: current.totalInteractions,
      interactionsChange: calculateChange(current.totalInteractions, previous.totalInteractions),
      successRate: current.totalInteractions ? current.successfulInteractions / current.totalInteractions : 0,
      successRateChange: calculateChange(
        current.totalInteractions ? current.successfulInteractions / current.totalInteractions : 0,
        previous.totalInteractions ? previous.successfulInteractions / previous.totalInteractions : 0
      ),
      avgResponseTime: current.totalInteractions ? Math.round(current.totalResponseTime / current.totalInteractions) : 0,
      responseTimeChange: calculateChange(
        current.totalInteractions ? current.totalResponseTime / current.totalInteractions : 0,
        previous.totalInteractions ? previous.totalResponseTime / previous.totalInteractions : 0
      ),
      humanHandoffs: current.humanHandoffs,
      handoffChange: calculateChange(current.humanHandoffs, previous.humanHandoffs)
    });
  } catch (error) {
    console.error('Error fetching chatbot analytics:', error);
    res.status(500).json({ message: 'Error fetching chatbot analytics' });
  }
});

// Get property locations for map
router.get('/properties/locations', async (req, res) => {
  try {
    const properties = await Property.find(
      { 'location.coordinates': { $exists: true } },
      {
        title: 1,
        'location.coordinates': 1,
        'location.address': 1,
        price: 1,
        propertyType: 1,
        status: 1
      }
    ).limit(1000);

    res.json(properties);
  } catch (error) {
    console.error('Error fetching property locations:', error);
    res.status(500).json({ message: 'Error fetching property locations' });
  }
});

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      pendingCount,
      reportedPostsCount,
      reportedUsersCount,
      totalApproved,
      totalRejected
    ] = await Promise.all([
      Post.countDocuments({ status: 'pending' }),
      Post.countDocuments({ 'reports.0': { $exists: true } }),
      User.countDocuments({ 'reports.0': { $exists: true } }),
      Post.countDocuments({ status: 'approved' }),
      Post.countDocuments({ status: 'rejected' })
    ]);

    res.json({
      pendingCount,
      reportedPostsCount,
      reportedUsersCount,
      totalApproved,
      totalRejected
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
});

// Get pending posts
router.get('/pending-posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending' })
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    res.status(500).json({ message: 'Error fetching pending posts' });
  }
});

// Get reported posts
router.get('/reported-posts', async (req, res) => {
  try {
    const posts = await Post.find({ 'reports.0': { $exists: true } })
      .populate('owner', 'name email avatar')
      .populate('reports.reportedBy', 'name email')
      .sort({ 'reports.length': -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching reported posts:', error);
    res.status(500).json({ message: 'Error fetching reported posts' });
  }
});

// Get reported users
router.get('/reported-users', async (req, res) => {
  try {
    const users = await User.find({ 'reports.0': { $exists: true } })
      .select('-password')
      .populate('reports.reportedBy', 'name email')
      .sort({ 'reports.length': -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching reported users:', error);
    res.status(500).json({ message: 'Error fetching reported users' });
  }
});

// Approve a post
router.post('/posts/:postId/approve', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('owner', 'email name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = 'approved';
    post.moderationNotes = req.body.reason || 'Approved by admin';
    post.moderatedAt = new Date();
    post.moderatedBy = req.user._id;
    
    await post.save();

    // Send email notification to post owner
    await sendEmail({
      to: post.owner.email,
      subject: 'Your Post Has Been Approved',
      text: `Dear ${post.owner.name},\n\nYour property listing "${post.title}" has been approved and is now live on our platform.\n\nBest regards,\nThe House Rental Team`
    });

    res.json({ message: 'Post approved successfully', post });
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ message: 'Error approving post' });
  }
});

// Reject a post
router.post('/posts/:postId/reject', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('owner', 'email name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = 'rejected';
    post.moderationNotes = req.body.reason || 'Rejected by admin';
    post.moderatedAt = new Date();
    post.moderatedBy = req.user._id;
    
    await post.save();

    // Send email notification to post owner
    await sendEmail({
      to: post.owner.email,
      subject: 'Your Post Has Been Rejected',
      text: `Dear ${post.owner.name},\n\nUnfortunately, your property listing "${post.title}" has been rejected.\n\nReason: ${post.moderationNotes}\n\nIf you believe this is a mistake, please contact our support team.\n\nBest regards,\nThe House Rental Team`
    });

    res.json({ message: 'Post rejected successfully', post });
  } catch (error) {
    console.error('Error rejecting post:', error);
    res.status(500).json({ message: 'Error rejecting post' });
  }
});

// Ban a user
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'banned';
    user.banReason = req.body.reason || 'Banned by admin';
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    
    await user.save();

    // Delete all pending posts by the banned user
    await Post.updateMany(
      { owner: user._id, status: 'pending' },
      { status: 'rejected', moderationNotes: 'User banned' }
    );

    // Send email notification to banned user
    await sendEmail({
      to: user.email,
      subject: 'Account Banned',
      text: `Dear ${user.name},\n\nYour account has been banned from our platform.\n\nReason: ${user.banReason}\n\nIf you believe this is a mistake, please contact our support team.\n\nBest regards,\nThe House Rental Team`
    });

    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Error banning user' });
  }
});

// Clear reports for a post
router.post('/posts/:postId/clear-reports', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.reports = [];
    await post.save();

    res.json({ message: 'Reports cleared successfully', post });
  } catch (error) {
    console.error('Error clearing reports:', error);
    res.status(500).json({ message: 'Error clearing reports' });
  }
});

// Clear reports for a user
router.post('/users/:userId/clear-reports', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.reports = [];
    await user.save();

    res.json({ message: 'Reports cleared successfully', user });
  } catch (error) {
    console.error('Error clearing reports:', error);
    res.status(500).json({ message: 'Error clearing reports' });
  }
});

// Super Admin Routes
router.use('/super', auth, isSuperAdmin);

// Get all admins
router.get('/super/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Assign admin role
router.post('/super/admins/assign/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    // Send email notification
    await sendEmail({
      to: user.email,
      subject: 'Admin Role Assignment',
      text: `Dear ${user.name},\n\nYou have been assigned the role of ${role} on our platform.\n\nBest regards,\nThe House Rental Team`
    });

    res.json({ message: 'Admin role assigned successfully', user });
  } catch (error) {
    console.error('Error assigning admin role:', error);
    res.status(500).json({ message: 'Error assigning admin role' });
  }
});

// Remove admin role
router.post('/super/admins/remove/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent removing the last super admin
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove your own admin role' });
    }

    const superAdminCount = await User.countDocuments({ role: 'superadmin' });
    const user = await User.findById(userId);

    if (user.role === 'superadmin' && superAdminCount <= 1) {
      return res.status(400).json({ message: 'Cannot remove the last super admin' });
    }

    user.role = 'user';
    await user.save();

    // Send email notification
    await sendEmail({
      to: user.email,
      subject: 'Admin Role Removed',
      text: `Dear ${user.name},\n\nYour admin privileges have been removed from our platform.\n\nBest regards,\nThe House Rental Team`
    });

    res.json({ message: 'Admin role removed successfully', user });
  } catch (error) {
    console.error('Error removing admin role:', error);
    res.status(500).json({ message: 'Error removing admin role' });
  }
});

// Get system settings
router.get('/super/settings', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update system settings
router.put('/super/settings', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const updates = req.body;

    // Validate and update each setting
    for (const [key, value] of Object.entries(updates)) {
      if (key in settings) {
        settings[key] = value;
      }
    }

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Get admin activity logs
router.get('/super/activity-logs', async (req, res) => {
  try {
    const { startDate, endDate, adminId } = req.query;
    const query = {
      moderatedBy: adminId ? mongoose.Types.ObjectId(adminId) : { $exists: true },
      moderatedAt: {}
    };

    if (startDate) {
      query.moderatedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.moderatedAt.$lte = new Date(endDate);
    }

    const logs = await Post.find(query)
      .select('title status moderationNotes moderatedBy moderatedAt')
      .populate('moderatedBy', 'name email')
      .sort({ moderatedAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

// Get system health metrics
router.get('/super/health', async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalReports,
      activeUsers24h,
      newUsers24h,
      storageUsed
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Report.countDocuments(),
      User.countDocuments({
        lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      Post.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: { $size: '$images' } }
          }
        }
      ])
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalReports,
      activeUsers24h,
      newUsers24h,
      storageUsed: storageUsed[0]?.totalSize || 0,
      serverUptime: process.uptime(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage()
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ message: 'Error fetching system health' });
  }
});

module.exports = router;
