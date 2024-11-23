const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  createAdmin,
  updateUserRole
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Super Admin only routes
router.post('/create-admin', protect, authorize('super-admin'), createAdmin);
router.put('/update-role/:userId', protect, authorize('super-admin'), updateUserRole);

module.exports = router;
