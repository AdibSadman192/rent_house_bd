const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroupMembers,
  joinGroup,
  leaveGroup
} = require('../controllers/groupController');

// Base route: /api/groups

// Public routes
router.get('/', getGroups);

// Protected routes
router.post('/', protect, createGroup);
router.get('/:id/members', protect, getGroupMembers);
router.post('/:id/join', protect, joinGroup);
router.delete('/:id/leave', protect, leaveGroup);

module.exports = router;