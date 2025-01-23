const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  nidNumber: {
    type: String,
    required: true,
    unique: true
  },
  nidFrontImage: {
    type: String,
    required: true
  },
  nidBackImage: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  permanentAddress: {
    division: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    upazila: {
      type: String,
      required: true
    },
    union: String,
    postCode: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{4}$/.test(v);
        },
        message: 'Invalid Bangladesh postal code'
      }
    },
    address: {
      type: String,
      required: true
    }
  },
  profession: {
    type: String,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  additionalDocuments: [{
    documentType: {
      type: String,
      enum: ['job_certificate', 'salary_slip', 'bank_statement', 'trade_license', 'other']
    },
    documentUrl: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
userVerificationSchema.index({ user: 1 });
userVerificationSchema.index({ nidNumber: 1 });
userVerificationSchema.index({ verificationStatus: 1 });

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

module.exports = UserVerification;
