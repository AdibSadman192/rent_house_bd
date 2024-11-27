const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tenant is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  depositAmount: {
    type: Number,
    required: [true, 'Deposit amount is required']
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'proof_of_income', 'rental_agreement', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  moveInDetails: {
    preferredTime: String,
    specialRequests: String,
    parkingRequired: Boolean,
    movingCompany: {
      name: String,
      contact: String
    }
  },
  cancellation: {
    date: Date,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate duration in months
bookingSchema.virtual('durationMonths').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24 * 30));
});

// Add validation for booking dates
bookingSchema.pre('validate', function(next) {
  if (this.startDate >= this.endDate) {
    throw new Error('End date must be after start date');
  }
  next();
});

// Ensure end date is after start date
bookingSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ property: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ tenant: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });

// Check for booking conflicts
bookingSchema.statics.checkAvailability = async function(propertyId, startDate, endDate, excludeBookingId = null) {
  const query = {
    property: propertyId,
    status: { $nin: ['rejected', 'cancelled'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const conflictingBooking = await this.findOne(query);
  return !conflictingBooking;
};

// Calculate total amount
bookingSchema.methods.calculateTotalAmount = async function() {
  const property = await mongoose.model('Property').findById(this.property);
  if (!property) throw new Error('Property not found');
  
  const durationMonths = this.durationMonths;
  this.totalAmount = property.price * durationMonths;
  this.depositAmount = property.price; // One month rent as deposit
  
  return this.totalAmount;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
