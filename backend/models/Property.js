/**
 * @module models/Property
 * @description Property model for storing rental property information
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Location
 * @property {String} address - Full address of the property
 * @property {String} city - City where the property is located
 * @property {String} area - Specific area or neighborhood
 * @property {Object} coordinates - GeoJSON coordinates
 * @property {Number} coordinates.longitude - Longitude coordinate
 * @property {Number} coordinates.latitude - Latitude coordinate
 */

/**
 * @typedef {Object} Amenity
 * @property {String} name - Name of the amenity
 * @property {String} description - Description of the amenity
 * @property {Boolean} isAvailable - Whether the amenity is currently available
 */

/**
 * Property Schema
 * @typedef {Object} PropertySchema
 */
const propertySchema = new mongoose.Schema({
  /**
   * Title of the property listing
   * @type {String}
   * @required
   */
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true
  },
  /**
   * Detailed description of the property
   * @type {String}
   * @required
   */
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  /**
   * Address of the property
   * @type {Object}
   * @required
   */
  address: {
    /**
     * Street address of the property
     * @type {String}
     * @required
     */
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    /**
     * House number of the property
     * @type {String}
     * @required
     */
    houseNumber: {
      type: String,
      required: [true, 'Please add a house number']
    },
    /**
     * Floor number of the property
     * @type {Number}
     * @required
     */
    floor: {
      type: Number,
      required: [true, 'Please specify the floor number'],
      min: [0, 'Floor number cannot be negative']
    },
    /**
     * Division of the property
     * @type {String}
     * @required
     */
    division: {
      type: String,
      required: [true, 'Please add a division'],
      enum: {
        values: [
          'Dhaka',
          'Chittagong',
          'Rajshahi',
          'Khulna',
          'Barishal',
          'Sylhet',
          'Rangpur',
          'Mymensingh'
        ],
        message: '{VALUE} is not a valid division'
      },
      index: true
    },
    /**
     * District of the property
     * @type {String}
     * @required
     */
    district: {
      type: String,
      required: [true, 'Please add a district'],
      index: true
    },
    /**
     * Thana/Upazila of the property
     * @type {String}
     * @required
     */
    thana: {
      type: String,
      required: [true, 'Please add a thana/upazila'],
      index: true
    },
    /**
     * Area of the property
     * @type {String}
     * @required
     */
    area: {
      type: String,
      required: [true, 'Please add an area']
    },
    /**
     * Postal code of the property
     * @type {String}
     * @required
     */
    postCode: {
      type: String,
      required: [true, 'Please add a postal code'],
      validate: {
        validator: function(v) {
          return /^\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid Bangladesh postal code!`
      }
    },
    /**
     * Country of the property
     * @type {String}
     * @required
     */
    country: {
      type: String,
      default: 'Bangladesh',
      required: true
    }
  },
  /**
   * Location of the property
   * @type {Object}
   * @required
   */
  location: {
    /**
     * Type of location (Point)
     * @type {String}
     * @required
     */
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    /**
     * Coordinates of the property
     * @type {Array}
     * @required
     */
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: props => 'Invalid coordinates!'
      }
    }
  },
  /**
   * Price of the property
   * @type {Object}
   * @required
   */
  price: {
    /**
     * Amount of the price
     * @type {Number}
     * @required
     */
    amount: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
      index: true
    },
    /**
     * Currency of the price (BDT)
     * @type {String}
     * @required
     */
    currency: {
      type: String,
      default: 'BDT',
      enum: ['BDT']
    },
    /**
     * Whether the price is negotiable
     * @type {Boolean}
     */
    negotiable: {
      type: Boolean,
      default: false
    },
    /**
     * Advance payment amount
     * @type {Number}
     * @required
     */
    advancePayment: {
      type: Number,
      required: [true, 'Please specify advance payment amount'],
      min: [0, 'Advance payment cannot be negative']
    }
  },
  /**
   * Type of property (Apartment, House, etc.)
   * @type {String}
   * @required
   */
  propertyType: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: {
      values: [
        'Apartment',
        'House',
        'Duplex',
        'Studio',
        'Villa',
        'Office',
        'Shop',
        'Warehouse',
        'Bachelor',
        'Family',
        'Sublet',
        'Mess',
        'Hostel'
      ],
      message: '{VALUE} is not supported'
    },
    index: true
  },
  /**
   * Status of the property (available, rented, etc.)
   * @type {String}
   * @required
   */
  status: {
    type: String,
    enum: {
      values: ['available', 'rented', 'maintenance', 'inactive'],
      message: '{VALUE} is not supported'
    },
    default: 'available',
    index: true
  },
  /**
   * Features of the property
   * @type {Object}
   */
  features: {
    /**
     * Size of the property
     * @type {Object}
     */
    size: {
      /**
       * Value of the size
       * @type {Number}
       * @required
       */
      value: {
        type: Number,
        required: [true, 'Please specify the size'],
        min: [0, 'Size cannot be negative']
      },
      /**
       * Unit of the size (sqft, katha, bigha)
       * @type {String}
       */
      unit: {
        type: String,
        enum: ['sqft', 'katha', 'bigha'],
        default: 'sqft'
      }
    },
    /**
     * Number of bedrooms in the property
     * @type {Number}
     * @required
     */
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [0, 'Number of bedrooms cannot be negative']
    },
    /**
     * Number of bathrooms in the property
     * @type {Number}
     * @required
     */
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [0, 'Number of bathrooms cannot be negative']
    },
    /**
     * Number of balconies in the property
     * @type {Number}
     */
    balconies: {
      type: Number,
      default: 0,
      min: [0, 'Number of balconies cannot be negative']
    },
    /**
     * Parking information of the property
     * @type {Object}
     */
    parking: {
      /**
       * Whether parking is available
       * @type {Boolean}
       */
      available: {
        type: Boolean,
        default: false
      },
      /**
       * Type of parking (car, bike, both, none)
       * @type {String}
       */
      type: {
        type: String,
        enum: ['car', 'bike', 'both', 'none'],
        default: 'none'
      }
    },
    /**
     * Furnished status of the property
     * @type {String}
     */
    furnished: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    },
    /**
     * Utilities available in the property
     * @type {Object}
     */
    utilities: {
      /**
       * Whether electricity is available
       * @type {Boolean}
       */
      electricity: {
        type: Boolean,
        default: true
      },
      /**
       * Whether gas is available
       * @type {Boolean}
       */
      gas: {
        type: Boolean,
        default: false
      },
      /**
       * Whether water is available
       * @type {Boolean}
       */
      water: {
        type: Boolean,
        default: true
      },
      /**
       * Whether internet is available
       * @type {Boolean}
       */
      internet: {
        type: Boolean,
        default: false
      },
      /**
       * Whether maintenance is available
       * @type {Boolean}
       */
      maintenance: {
        type: Boolean,
        default: false
      }
    },
    /**
     * Amenities available in the property
     * @type {Array}
     */
    amenities: [{
      type: String,
      enum: [
        'lift',
        'generator',
        'security',
        'cctv',
        'intercom',
        'prayer_room',
        'community_hall',
        'roof_access',
        'gym',
        'playground'
      ]
    }]
  },
  /**
   * Preferences of the property
   * @type {Object}
   */
  preferences: {
    /**
     * Type of tenant preferred
     * @type {Array}
     */
    tenantType: [{
      type: String,
      enum: ['family', 'bachelor', 'office', 'student', 'any'],
      default: ['any']
    }],
    /**
     * Gender preference
     * @type {String}
     */
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    /**
     * Maximum number of occupants
     * @type {Number}
     */
    maxOccupants: {
      type: Number,
      min: [1, 'Maximum occupants must be at least 1']
    },
    /**
     * Whether pets are allowed
     * @type {Boolean}
     */
    petsAllowed: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Images of the property
   * @type {Array}
   */
  images: [{
    /**
     * URL of the image
     * @type {String}
     * @required
     */
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(v);
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    },
    /**
     * Alt text of the image
     * @type {String}
     */
    alt: {
      type: String,
      default: 'Property image'
    }
  }],
  /**
   * Virtual tour URL of the property
   * @type {String}
   */
  virtualTour: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  /**
   * Owner of the property
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  /**
   * Rating of the property
   * @type {Number}
   */
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  /**
   * Reviews of the property
   * @type {Array}
   */
  reviews: [{
    /**
     * User who made the review
     * @type {mongoose.Schema.Types.ObjectId}
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    /**
     * Rating given by the user
     * @type {Number}
     * @required
     */
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    /**
     * Comment made by the user
     * @type {String}
     * @required
     */
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    /**
     * Date when the review was made
     * @type {Date}
     */
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for location-based searches
propertySchema.index({ 'location': '2dsphere', 'status': 1, 'price': 1 });

// Virtual for average rating
propertySchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Method to check if property is available for a date range
propertySchema.methods.isAvailable = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  const conflictingBookings = await Booking.find({
    property: this._id,
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

// Add indexes to improve query performance
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.division': 1,
  'address.district': 1
});

// Add text index for search
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.street': 'text',
  'address.city': 'text',
  'address.area': 'text'
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
