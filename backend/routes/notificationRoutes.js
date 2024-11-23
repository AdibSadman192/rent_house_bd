const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const {
    getNotifications,
    getPreferences,
    updatePreferences,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');

// Input validation middleware
const validatePreferences = [
    body('email').isBoolean().optional(),
    body('push').isBoolean().optional(),
    body('sms').isBoolean().optional(),
    body('sound').isBoolean().optional(),
    body('bookings').isBoolean().optional(),
    body('messages').isBoolean().optional(),
    body('propertyUpdates').isBoolean().optional(),
    body('marketing').isBoolean().optional()
];

// Get unread notification count
router.get('/unread/count', protect, asyncHandler(async (req, res) => {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({
        success: true,
        data: { count }
    });
}));

// Mark all notifications as read
router.put('/read/all', protect, asyncHandler(async (req, res) => {
    await Notification.markAllAsRead(req.user.id);
    res.json({
        success: true,
        message: 'All notifications marked as read'
    });
}));

// Delete all notifications
router.delete('/all', protect, asyncHandler(async (req, res) => {
    await Notification.deleteMany({ user: req.user.id });
    res.json({
        success: true,
        message: 'All notifications deleted'
    });
}));

// Main routes
router.get('/', protect, getNotifications);
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, validatePreferences, updatePreferences);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
