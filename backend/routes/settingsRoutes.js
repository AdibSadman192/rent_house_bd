const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/fileUpload');
const settingsController = require('../controllers/settingsController');

// Get all settings
router.get('/', protect, settingsController.getAllSettings);

// Profile routes
router.put('/profile', protect, settingsController.updateProfile);
router.put('/profile/image', protect, upload.single('image'), settingsController.updateProfileImage);

// Security routes
router.put('/security/password', protect, settingsController.updatePassword);
router.put('/security/settings', protect, settingsController.updateSecuritySettings);
router.get('/security/logs', protect, settingsController.getSecurityLogs);

// Notification routes
router.put('/notifications', protect, settingsController.updateNotificationPreferences);

// Theme routes
router.put('/theme', protect, settingsController.updateTheme);

// Language routes
router.put('/language', protect, settingsController.updateLanguage);

module.exports = router;
