const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, nid, address, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists with email
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // If NID is provided, check if it's unique
    if (nid) {
      const existingNID = await User.findOne({ nid });
      if (existingNID) {
        return res.status(400).json({
          message: 'This National ID is already registered'
        });
      }
    }

    // Create user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      ...(nid && { nid }), // Only include NID if it's provided
      address,
      role: role || 'user'
    });

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
      { expiresIn: '90d' }
    );

    // Set cookies
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=7776000; SameSite=Strict`
    ]);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `User already exists with this ${field === 'nid' ? 'National ID' : field}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
      { expiresIn: '90d' }
    );

    // Set cookies
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=7776000; SameSite=Strict`
    ]);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while getting current user.',
      error: error.message
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

    const { firstName, lastName, email, password, phone, nid, address } = req.body;

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
      firstName,
      lastName,
      email,
      password,
      phone,
      nid,
      address,
      role: 'admin',
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        nid: admin.nid,
        address: admin.address,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating admin user.',
      error: error.message
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
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating user role.',
      error: error.message
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
    const isMatch = await bcrypt.compare(currentPassword, user.password);
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
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while changing password.',
      error: error.message
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
    const isMatch = await bcrypt.compare(password, user.password);
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
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting account.',
      error: error.message
    });
  }
};
