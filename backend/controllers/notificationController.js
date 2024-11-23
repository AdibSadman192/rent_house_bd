const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate('sender', 'name email');

    const total = await Notification.countDocuments({ user: req.user.id });

    res.json({
        success: true,
        data: {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// @desc    Get user's notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
exports.getPreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .select('preferences.notifications');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        data: user.preferences?.notifications || {}
    });
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updatePreferences = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Invalid input data');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Initialize notifications preferences if they don't exist
    if (!user.preferences) {
        user.preferences = {};
    }
    if (!user.preferences.notifications) {
        user.preferences.notifications = {};
    }

    // Update only provided preferences
    const validPreferences = [
        'email', 'push', 'sms', 'sound',
        'bookings', 'messages', 'propertyUpdates', 'marketing'
    ];

    for (const pref of validPreferences) {
        if (req.body[pref] !== undefined) {
            user.preferences.notifications[pref] = req.body[pref];
        }
    }

    await user.save();

    res.json({
        success: true,
        data: user.preferences.notifications
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    res.json({
        success: true,
        data: notification
    });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.remove();

    res.json({
        success: true,
        data: {}
    });
});
