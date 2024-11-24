const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus,
  getUserStats
} = require('../controllers/userController');

// Public routes
router.get('/stats', protect, authorize('admin', 'super-admin'), getUserStats);

// Protected routes
router.use(protect);

// Admin only routes
router.use(authorize('admin', 'super-admin'));
router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/role', authorize('super-admin'), updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
