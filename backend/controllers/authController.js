const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user or renter
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, nid, address, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { nid }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or NID',
      });
    }

    // Only allow registration for 'user' and 'renter' roles
    if (role && !['user', 'renter'].includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid role specified. Only users and renters can register.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      nid,
      address,
      role: role || 'user', // Default to 'user' if role not specified
      isVerified: role === 'renter' ? false : true, // Renters need verification
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          nid: user.nid,
          address: user.address,
          role: user.role,
          isVerified: user.isVerified,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unified login for all roles
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // For renters, check if they are verified
    if (user.role === 'renter' && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending verification. Please contact admin.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        nid: user.nid,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create admin user (Super Admin only)
// @route   POST /api/auth/create-admin
// @access  Private/Super Admin
exports.createAdmin = async (req, res) => {
  try {
    // Check if the requesting user is a super admin
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can create admin accounts',
      });
    }

    const { name, email, password, nid, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { nid }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or NID',
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      nid,
      address,
      role: 'admin',
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        nid: admin.nid,
        address: admin.address,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user role (Super Admin only)
// @route   PUT /api/auth/update-role/:userId
// @access  Private/Super Admin
exports.updateUserRole = async (req, res) => {
  try {
    // Check if the requesting user is a super admin
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can update user roles',
      });
    }

    const { role } = req.body;
    const { userId } = req.params;

    // Validate role
    if (!['user', 'renter', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    // Update user role
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Delete user's avatar if exists
    if (user.avatar) {
      const avatarPath = path.join(__dirname, '../public/uploads/avatars', user.avatar);
      try {
        await fs.unlink(avatarPath);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    // Delete user's properties
    await Property.deleteMany({ owner: user._id });

    // Delete user's bookings
    await Booking.deleteMany({ user: user._id });

    // Delete user's reviews
    await Review.deleteMany({ user: user._id });

    // Delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message,
    });
  }
};
