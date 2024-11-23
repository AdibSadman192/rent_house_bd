const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  postApprovalRequired: {
    type: Boolean,
    default: true,
    description: 'Require admin approval for new property listings'
  },
  maxImagesPerPost: {
    type: Number,
    default: 10,
    description: 'Maximum number of images allowed per property listing'
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024, // 5MB
    description: 'Maximum file size for uploads in bytes'
  },
  allowedFileTypes: {
    type: [String],
    default: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    description: 'Allowed file types for uploads'
  },
  userVerificationRequired: {
    type: Boolean,
    default: true,
    description: 'Require email verification for new users'
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
    description: 'Put the site in maintenance mode'
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'support@houserental.com',
    description: 'Contact email for support'
  },
  reportThreshold: {
    type: Number,
    default: 5,
    description: 'Number of reports before content is automatically hidden'
  },
  userRoles: {
    type: Map,
    of: {
      permissions: [String],
      description: String
    },
    default: {
      'user': {
        permissions: ['create_post', 'send_message'],
        description: 'Regular user'
      },
      'admin': {
        permissions: ['manage_posts', 'manage_users', 'view_reports'],
        description: 'Administrator'
      },
      'superadmin': {
        permissions: ['manage_settings', 'manage_admins', 'all'],
        description: 'Super Administrator'
      }
    }
  },
  chatSettings: {
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB
      description: 'Maximum file size for chat attachments'
    },
    messageRetentionDays: {
      type: Number,
      default: 30,
      description: 'Number of days to retain chat messages'
    },
    allowVoiceMessages: {
      type: Boolean,
      default: true,
      description: 'Allow voice messages in chat'
    }
  },
  analytics: {
    googleAnalyticsId: {
      type: String,
      default: '',
      description: 'Google Analytics tracking ID'
    },
    enableErrorTracking: {
      type: Boolean,
      default: true,
      description: 'Enable error tracking and reporting'
    }
  },
  seo: {
    title: {
      type: String,
      default: 'House Rental Platform',
      description: 'Default site title'
    },
    description: {
      type: String,
      default: 'Find your perfect rental property',
      description: 'Default site description'
    },
    keywords: {
      type: [String],
      default: ['house', 'rental', 'property', 'real estate'],
      description: 'Default SEO keywords'
    }
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Validate settings before save
settingsSchema.pre('save', function(next) {
  // Ensure reportThreshold is positive
  if (this.reportThreshold < 1) {
    this.reportThreshold = 1;
  }

  // Ensure maxImagesPerPost is within reasonable limits
  if (this.maxImagesPerPost < 1) {
    this.maxImagesPerPost = 1;
  } else if (this.maxImagesPerPost > 50) {
    this.maxImagesPerPost = 50;
  }

  // Ensure maxFileSize is within limits
  const maxAllowedSize = 50 * 1024 * 1024; // 50MB
  if (this.maxFileSize > maxAllowedSize) {
    this.maxFileSize = maxAllowedSize;
  }

  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
