const path = require('path');
const sharp = require('sharp');
const User = require('../models/User');
const fs = require('fs').promises;

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../public/uploads/avatars');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `avatar-${user._id}-${Date.now()}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process and optimize image
    await sharp(req.file.buffer)
      .resize(200, 200, { // Resize to standard avatar size
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 }) // Convert to WebP format
      .toFile(filepath);

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(uploadsDir, user.avatar);
      try {
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    // Update user avatar in database
    user.avatar = filename;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        avatar: `/uploads/avatars/${filename}`,
      },
      message: 'Avatar uploaded successfully',
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
};
