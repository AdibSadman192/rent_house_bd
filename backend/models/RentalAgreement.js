const mongoose = require('mongoose');

const rentalAgreementSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agreementType: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'mess_hostel']
  },
  agreementLanguage: {
    type: String,
    required: true,
    enum: ['english', 'bengali', 'both'],
    default: 'both'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  advancePayment: {
    months: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  utilities: {
    electricity: {
      type: String,
      enum: ['included', 'excluded', 'shared'],
      required: true
    },
    water: {
      type: String,
      enum: ['included', 'excluded', 'shared'],
      required: true
    },
    gas: {
      type: String,
      enum: ['included', 'excluded', 'shared', 'not_applicable'],
      required: true
    }
  },
  monthlyCharges: [{
    type: {
      type: String,
      enum: ['service_charge', 'maintenance', 'garbage', 'other']
    },
    amount: Number,
    description: String
  }],
  specialConditions: [{
    condition: String,
    agreed: {
      type: Boolean,
      default: false
    }
  }],
  noticeRequired: {
    type: Number,
    required: true,
    default: 2, // months
    min: 1,
    max: 6
  },
  witnesses: [{
    name: {
      type: String,
      required: true
    },
    nidNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: String
  }],
  documents: [{
    type: {
      type: String,
      enum: ['agreement', 'nid_owner', 'nid_tenant', 'trade_license', 'other']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_signature', 'active', 'terminated', 'expired'],
    default: 'draft'
  },
  terminationDate: Date,
  terminationReason: String,
  signatures: {
    owner: {
      signed: {
        type: Boolean,
        default: false
      },
      date: Date
    },
    tenant: {
      signed: {
        type: Boolean,
        default: false
      },
      date: Date
    }
  },
  stampDuty: {
    paid: {
      type: Boolean,
      default: false
    },
    amount: Number,
    receiptNumber: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
rentalAgreementSchema.index({ property: 1, status: 1 });
rentalAgreementSchema.index({ owner: 1 });
rentalAgreementSchema.index({ tenant: 1 });
rentalAgreementSchema.index({ startDate: 1, endDate: 1 });

// Validate end date is after start date
rentalAgreementSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);

module.exports = RentalAgreement;
