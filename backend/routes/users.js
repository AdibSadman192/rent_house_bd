const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin', 'super-admin'));

router
  .route('/')
  .get(getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Super-admin only route
router
  .route('/:id/role')
  .patch(authorize('super-admin'), updateUserRole);

module.exports = router;
