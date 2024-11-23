const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { validatePassword } = require('../utils/validation');
const { 
    generateTwoFactorSecret, 
    verifyTwoFactorToken, 
    generateQRCode, 
    getClientInfo 
} = require('../utils/security');

// Profile Settings
// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        address,
        bio,
        occupation,
        website
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update user profile
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.address = address;
    user.bio = bio;
    user.occupation = occupation;
    user.website = website;
    user.updatedAt = new Date();

    await user.save();

    res.json({
        success: true,
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            bio: user.bio,
            occupation: user.occupation,
            website: user.website,
            profileImage: user.profileImage
        }
    });
});

// Profile Image
// @desc    Update profile image
// @route   PUT /api/settings/profile/image
// @access  Private
exports.updateProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update profile image path
    user.profileImage = req.file.path;
    user.updatedAt = new Date();
    await user.save();

    res.json({
        success: true,
        data: {
            profileImage: user.profileImage
        }
    });
});

// Security Settings
// @desc    Update password
// @route   PUT /api/settings/security/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
        res.status(400);
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log security event
    const clientInfo = getClientInfo(req);
    await user.logSecurityEvent('password_change', clientInfo);

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});

exports.updateSecuritySettings = asyncHandler(async (req, res) => {
    const {
        twoFactorEnabled,
        emailNotifications,
        loginAlerts,
        requirePasswordChange
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Handle 2FA enabling/disabling
    if (twoFactorEnabled !== undefined && twoFactorEnabled !== user.securitySettings?.twoFactorEnabled) {
        if (twoFactorEnabled) {
            const secret = generateTwoFactorSecret();
            const qrCode = await generateQRCode(secret);
            user.securitySettings = {
                ...user.securitySettings,
                twoFactorEnabled: true,
                twoFactorSecret: secret.base32,
                twoFactorQR: qrCode
            };
        } else {
            user.securitySettings = {
                ...user.securitySettings,
                twoFactorEnabled: false,
                twoFactorSecret: undefined,
                twoFactorQR: undefined
            };
        }
    }

    // Update other security settings
    user.securitySettings = {
        ...user.securitySettings,
        emailNotifications,
        loginAlerts,
        requirePasswordChange
    };

    await user.save();

    // Log security event
    const clientInfo = getClientInfo(req);
    await user.logSecurityEvent('security_settings_update', clientInfo);

    res.json({
        success: true,
        data: {
            twoFactorEnabled: user.securitySettings.twoFactorEnabled,
            emailNotifications: user.securitySettings.emailNotifications,
            loginAlerts: user.securitySettings.loginAlerts,
            requirePasswordChange: user.securitySettings.requirePasswordChange,
            twoFactorQR: user.securitySettings.twoFactorQR
        }
    });
});

exports.getSecurityLogs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        data: user.securityLogs
    });
});

// Notification Settings
// @desc    Update notification preferences
// @route   PUT /api/settings/notifications
// @access  Private
exports.updateNotificationPreferences = asyncHandler(async (req, res) => {
    const preferences = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Initialize preferences if they don't exist
    user.preferences = user.preferences || {};
    user.preferences.notifications = {
        ...user.preferences.notifications,
        ...preferences
    };

    await user.save();

    res.json({
        success: true,
        data: user.preferences.notifications
    });
});

// Theme Settings
// @desc    Update theme
// @route   PUT /api/settings/theme
// @access  Private
exports.updateTheme = asyncHandler(async (req, res) => {
    const { theme } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!['light', 'dark', 'system'].includes(theme)) {
        res.status(400);
        throw new Error('Invalid theme option');
    }

    user.preferences = user.preferences || {};
    user.preferences.theme = theme;
    await user.save();

    res.json({
        success: true,
        data: {
            theme: user.preferences.theme
        }
    });
});

// Language Settings
// @desc    Update language
// @route   PUT /api/settings/language
// @access  Private
exports.updateLanguage = asyncHandler(async (req, res) => {
    const { language } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!['en', 'bn'].includes(language)) {
        res.status(400);
        throw new Error('Invalid language option');
    }

    user.preferences = user.preferences || {};
    user.preferences.language = language;
    await user.save();

    res.json({
        success: true,
        data: {
            language: user.preferences.language
        }
    });
});

// Get All Settings
// @desc    Get all settings
// @route   GET /api/settings
// @access  Private
exports.getAllSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .select('-password -securitySettings.twoFactorSecret');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        data: {
            profile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                bio: user.bio,
                occupation: user.occupation,
                website: user.website,
                profileImage: user.profileImage
            },
            security: {
                twoFactorEnabled: user.securitySettings?.twoFactorEnabled,
                emailNotifications: user.securitySettings?.emailNotifications,
                loginAlerts: user.securitySettings?.loginAlerts,
                requirePasswordChange: user.securitySettings?.requirePasswordChange
            },
            notifications: user.preferences?.notifications,
            preferences: {
                theme: user.preferences?.theme || 'system',
                language: user.preferences?.language || 'en'
            }
        }
    });
});
