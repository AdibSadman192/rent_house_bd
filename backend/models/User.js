const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String
}, { _id: false });

const securityLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'password_change', 'settings_change', 'failed_login', '2fa_enabled', '2fa_disabled']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  device: String,
  location: String,
  ip: String,
  details: mongoose.Schema.Types.Mixed
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(?:\+?88)?01[3-9]\d{8}$/, 'Please enter a valid Bangladesh phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  nid: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'renter', 'admin', 'super-admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    backupCodes: {
      type: [String],
      select: false
    },
    loginNotifications: {
      type: Boolean,
      default: true
    },
    activityAlerts: {
      type: Boolean,
      default: true
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    passwordHistory: {
      type: [String],
      select: false,
      default: []
    },
    logs: {
      type: [securityLogSchema],
      default: []
    }
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    preferences: {
      bookings: {
        type: Boolean,
        default: true
      },
      messages: {
        type: Boolean,
        default: true
      },
      reviews: {
        type: Boolean,
        default: true
      },
      system: {
        type: Boolean,
        default: true
      }
    }
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      enum: ['en', 'bn'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Dhaka'
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  activityLog: {
    type: [activityLogSchema],
    default: [],
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for calculating account age in days
userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Add to password history
    if (this.security.passwordHistory.length >= 5) {
      this.security.passwordHistory.pop();
    }
    this.security.passwordHistory.unshift(this.password);
    this.security.lastPasswordChange = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to get public profile
userSchema.methods.toPublicProfile = function() {
  const { password, security, activityLog, ...publicProfile } = this.toObject();
  return publicProfile;
};

// Method to log security event
userSchema.methods.logSecurityEvent = async function(eventType, device, location, ip, details = {}) {
  this.security.logs.unshift({
    eventType,
    device,
    location,
    ip,
    details,
    timestamp: new Date()
  });

  if (this.security.logs.length > 50) {
    this.security.logs = this.security.logs.slice(0, 50);
  }

  await this.save();
};

// Method to update security settings
userSchema.methods.updateSecuritySettings = async function(settings) {
  Object.assign(this.security, settings);
  await this.save();
  return this.security;
};

// Method to update notification preferences
userSchema.methods.updateNotificationPreferences = async function(preferences) {
  Object.assign(this.notifications, preferences);
  await this.save();
  return this.notifications;
};

// Method to update theme settings
userSchema.methods.updateTheme = async function(themeSettings) {
  Object.assign(this.settings, themeSettings);
  await this.save();
  return this.settings;
};

// Method to check if password change is required
userSchema.methods.isPasswordChangeRequired = function() {
  if (!this.security.lastPasswordChange) return true;
  
  const daysSinceLastChange = Math.floor(
    (Date.now() - this.security.lastPasswordChange) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastChange >= 90; // Require change every 90 days
};

module.exports = mongoose.model('User', userSchema);
