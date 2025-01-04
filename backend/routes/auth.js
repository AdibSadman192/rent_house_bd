const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minimum: 6
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, nid, address, role } = req.body;

    // Validate input
    if (!email || !password || !name || !phone || !nid || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate phone number format (Bangladeshi)
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid Bangladeshi phone number' });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { nid: nid.trim() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      if (existingUser.nid === nid.trim()) {
        return res.status(400).json({ message: 'NID is already registered' });
      }
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
      phone,
      nid: nid.trim(),
      address: address.trim(),
      role: role || 'user',
      emailVerified: false
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    const savedUser = await user.save();

    // Create tokens
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        emailVerified: savedUser.emailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} is already registered` });
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to an existing user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }

          // Create tokens
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
          );

          res.json({
            token,
            refreshToken,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified
            }
          });
        });
    })
    .catch(error => {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, (req, res) => {
  User.findById(req.user.userId)
    .select('-password')
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error while fetching user data' });
    });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    User.findById(decoded.userId)
      .select('-password')
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const newToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.json({ token: newToken });
      })
      .catch(error => {
        console.error('Token refresh error:', error);
        res.status(500).json({ message: 'Server error during token refresh' });
      });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from the current user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '1h' }
      );

      // TODO: Send password reset email
      // For now, return the token in response
      res.json({ 
        message: 'Password reset instructions sent to email',
        resetToken // Remove this in production
      });
    })
    .catch(error => {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error during password reset request' });
    });
});

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid or expired reset token
 */
router.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    
    User.findById(decoded.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hashedPassword => {
            user.password = hashedPassword;
            return user.save();
          })
          .then(() => {
            res.json({ message: 'Password reset successful' });
          });
      })
      .catch(error => {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
      });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password (when logged in)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid current password
 */
router.post('/change-password', protect, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      message: 'Current password and new password are required' 
    });
  }

  User.findById(req.user.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      bcrypt.compare(currentPassword, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
          }

          bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(newPassword, salt))
            .then(hashedPassword => {
              user.password = hashedPassword;
              return user.save();
            })
            .then(() => {
              res.json({ message: 'Password changed successfully' });
            });
        });
    })
    .catch(error => {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error during password change' });
    });
});

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid or expired verification token
 */
router.get('/verify-email/:token', (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    
    User.findById(decoded.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        if (user.emailVerified) {
          return res.status(400).json({ message: 'Email already verified' });
        }

        user.emailVerified = true;
        return user.save();
      })
      .then(() => {
        res.json({ message: 'Email verified successfully' });
      })
      .catch(error => {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Server error during email verification' });
      });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired verification token' });
    }
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post('/resend-verification', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_VERIFY_SECRET,
        { expiresIn: '24h' }
      );

      // TODO: Send verification email
      // For now, return the token in response
      res.json({ 
        message: 'Verification email sent',
        verificationToken // Remove this in production
      });
    })
    .catch(error => {
      console.error('Resend verification error:', error);
      res.status(500).json({ message: 'Server error during verification email resend' });
    });
});

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/delete-account', protect, (req, res) => {
  User.findByIdAndDelete(req.user.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Account deleted successfully' });
    })
    .catch(error => {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Server error during account deletion' });
    });
});

/**
 * @swagger
 * /api/auth/create-admin:
 *   post:
 *     summary: Create admin account (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin account created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/create-admin', [protect, isAdmin], (req, res) => {
  const { email, password, name, phone, nid, address } = req.body;

  if (!email || !password || !name || !phone || !nid || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = new User({
        email,
        password,
        name,
        phone,
        nid,
        address,
        role: 'admin',
        emailVerified: true
      });

      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
          user.password = hashedPassword;
          return user.save();
        })
        .then(() => {
          res.status(201).json({ message: 'Admin account created successfully' });
        });
    })
    .catch(error => {
      console.error('Create admin error:', error);
      res.status(500).json({ message: 'Server error during admin creation' });
    });
});

/**
 * @swagger
 * /api/auth/update-role/{userId}:
 *   put:
 *     summary: Update user role (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/update-role/:userId', [protect, isAdmin], (req, res) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Valid role is required' });
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.role = role;
      return user.save();
    })
    .then(() => {
      res.json({ message: 'User role updated successfully' });
    })
    .catch(error => {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Server error during role update' });
    });
});

module.exports = router;
