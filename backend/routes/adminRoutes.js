const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getPropertyAnalytics,
  getUserAnalytics,
  approveProperty,
  updateUserStatus,
  getSystemStats
} = require('../controllers/adminController');

// Protect all routes
router.use(protect);
router.use(authorize(['admin', 'super-admin']));

// Dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics/properties', getPropertyAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/system-stats', getSystemStats);

// Property management
router.put('/properties/:id/approve', approveProperty);

// User management
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
