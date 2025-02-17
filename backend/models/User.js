/**
 * @module models/User
 * @description User model for managing user accounts and profiles
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @typedef {Object} Address
 * @property {String} street - Street address
 * @property {String} city - City name
 * @property {String} division - Division/State
 * @property {String} postalCode - Postal/ZIP code
 */

/**
 * @typedef {Object} Verification
 * @property {Boolean} email - Email verification status
 * @property {Boolean} phone - Phone verification status
 * @property {Boolean} nid - National ID verification status
 */

/**
 * User Schema
 * @typedef {Object} UserSchema
 */
const userSchema = new mongoose.Schema({
  /**
   * User's full name
   * @type {String}
   * @required
   */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  /**
   * User's email address
   * @type {String}
   * @required
   * @unique
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  /**
   * User's phone number
   * @type {String}
   * @required
   */
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+88)?01[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number']
  },

  /**
   * National ID number
   * @type {String}
   * @unique
   */
  nid: {
    type: String,
    sparse: true, // This allows null/undefined values and only enforces uniqueness for non-null values
    trim: true,
    index: true, // Ensure index is created
    default: null // Explicitly set default to null
  },

  /**
   * User's password (hashed)
   * @type {String}
   * @required
   */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },

  /**
   * User's role
   * @type {String}
   * @enum {['user', 'owner', 'admin', 'super_admin']}
   */
  role: {
    type: String,
    enum: ['user', 'owner', 'admin', 'super_admin'],
    default: 'user'
  },

  connections: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  preferences: {
    emailNotifications: { 
      type: Boolean, 
      default: true 
    },
    pushNotifications: { 
      type: Boolean, 
      default: true 
    },
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'connections', 'private'],
        default: 'public'
      },
      activityVisibility: {
        type: String,
        enum: ['public', 'connections', 'private'],
        default: 'public'
      }
    }
  },
  /**
   * Profile picture URL
   * @type {String}
   */
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },

  /**
   * Account verification status
   * @type {Boolean}
   */
  isVerified: {
    type: Boolean,
    default: false
  },

  /**
   * Email verification token
   * @type {String}
   */
  verificationToken: String,

  /**
   * Email verification token expiry
   * @type {Date}
   */
  verificationTokenExpire: Date,

  /**
   * Password reset token
   * @type {String}
   */
  resetPasswordToken: String,

  /**
   * Password reset token expiry
   * @type {Date}
   */
  resetPasswordExpire: Date,

  /**
   * Account active status
   * @type {Boolean}
   */
  isActive: {
    type: Boolean,
    default: true
  },

  /**
   * Last login timestamp
   * @type {Date}
   */
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Sanitize data before saving
 * @function
 * @name preValidate
 */
userSchema.pre('validate', function(next) {
  this.email = this.email.toLowerCase();
  this.name = this.name.trim();
  next();
});

/**
 * Match user entered password to hashed password in database
 * @function
 * @name matchPassword
 * @param {String} enteredPassword - Password to check
 * @returns {Boolean} True if password matches
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate and hash password token
 * @function
 * @name getResetPasswordToken
 * @returns {String} Reset token
 */
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Generate email verification token
 * @function
 * @name getVerificationToken
 * @returns {String} Verification token
 */
userSchema.methods.getVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

module.exports = mongoose.model('User', userSchema);
