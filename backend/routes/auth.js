const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  changePassword, 
  deleteAccount,
  createAdmin,
  updateUserRole,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Input validation middleware
const validateRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  body('phone')
    .matches(/^(?:\+?88)?01[3-9]\d{8}$/)
    .withMessage('Please enter a valid Bangladesh phone number'),
  body('nid').trim().notEmpty().withMessage('National ID is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('role').optional().isIn(['user', 'renter']).withMessage('Invalid role')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
];

// Public routes
router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password/:token', asyncHandler(resetPassword));
router.get('/verify-email/:token', asyncHandler(verifyEmail));
router.post('/resend-verification', asyncHandler(resendVerification));

// Protected routes
router.get('/me', protect, asyncHandler(getMe));
router.post('/change-password', protect, validatePasswordChange, asyncHandler(changePassword));
router.delete('/delete-account', protect, asyncHandler(deleteAccount));

// Admin only routes
router.post('/create-admin', protect, authorize('super-admin'), asyncHandler(createAdmin));
router.put('/update-role/:userId', protect, authorize('super-admin'), asyncHandler(updateUserRole));

module.exports = router;
