/**
 * @module models/Booking
 * @description Booking model for managing property rentals and reservations
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} PaymentDetails
 * @property {Number} amount - Total payment amount
 * @property {String} currency - Currency code (e.g., BDT)
 * @property {String} status - Payment status
 * @property {String} transactionId - Payment transaction ID
 * @property {Date} paidAt - Payment timestamp
 */

/**
 * @typedef {Object} RentalTerms
 * @property {Number} rentAmount - Monthly rent amount
 * @property {Number} securityDeposit - Security deposit amount
 * @property {Boolean} utilitiesIncluded - Whether utilities are included
 * @property {String[]} additionalTerms - Additional rental terms
 */

/**
 * Booking Schema
 * @typedef {Object} BookingSchema
 */
const bookingSchema = new mongoose.Schema({
  /**
   * Reference to the property being booked
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },

  /**
   * Reference to the user making the booking
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },

  /**
   * Start date of the rental period
   * @type {Date}
   * @required
   */
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },

  /**
   * End date of the rental period
   * @type {Date}
   * @required
   */
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },

  /**
   * Status of the booking
   * @type {String}
   * @enum {['pending', 'confirmed', 'cancelled', 'completed']}
   */
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },

  /**
   * Payment details for the booking
   * @type {PaymentDetails}
   */
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },

  /**
   * Rental terms and conditions
   * @type {RentalTerms}
   */
  rentalTerms: {
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required']
    },
    utilitiesIncluded: {
      type: Boolean,
      default: false
    },
    additionalTerms: [String]
  },

  /**
   * Number of occupants
   * @type {Number}
   * @required
   */
  occupants: {
    type: Number,
    required: [true, 'Number of occupants is required'],
    min: [1, 'Must have at least 1 occupant']
  },

  /**
   * Special requests or notes
   * @type {String}
   */
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },

  /**
   * Cancellation reason if booking is cancelled
   * @type {String}
   */
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },

  /**
   * Timestamp when booking was cancelled
   * @type {Date}
   */
  cancelledAt: Date,

  /**
   * Reference to admin who processed the booking
   * @type {mongoose.Schema.Types.ObjectId}
   */
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  /**
   * Documents related to the booking
   * @type {Array}
   */
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Check if dates are available for booking
 * @function
 * @name checkAvailability
 * @param {Date} startDate - Start date to check
 * @param {Date} endDate - End date to check
 * @returns {Promise<Boolean>} True if dates are available
 */
bookingSchema.statics.checkAvailability = async function(propertyId, startDate, endDate) {
  const conflictingBookings = await this.find({
    property: propertyId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  });
  return conflictingBookings.length === 0;
};

/**
 * Calculate total booking amount
 * @function
 * @name calculateTotal
 * @returns {Number} Total booking amount
 */
bookingSchema.methods.calculateTotal = function() {
  const duration = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24 * 30));
  return (this.rentalTerms.rentAmount * duration) + this.rentalTerms.securityDeposit;
};

/**
 * Check if booking can be cancelled
 * @function
 * @name canBeCancelled
 * @returns {Boolean} True if booking can be cancelled
 */
bookingSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  const today = new Date();
  const startDate = new Date(this.startDate);
  const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
  return daysUntilStart > 7;
};

// Create compound index for availability checks
bookingSchema.index({ property: 1, status: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
