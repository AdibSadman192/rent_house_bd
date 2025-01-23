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
     * Division of the property
     * @type {String}
     * @required
     */
    division: {
      type: String,
      required: [true, 'Division is required'],
      enum: [
        'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
        'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
      ]
    },
    /**
     * District of the property
     * @type {String}
     * @required
     */
    district: {
      type: String,
      required: [true, 'District is required']
    },
    /**
     * Upazila/Thana of the property
     * @type {String}
     * @required
     */
    upazila: {
      type: String,
      required: [true, 'Upazila/Thana is required']
    },
    /**
     * Union of the property
     * @type {String}
     */
    union: String,
    /**
     * Area of the property
     * @type {String}
     * @required
     */
    area: {
      type: String,
      required: [true, 'Area name is required']
    },
    /**
     * Road number of the property
     * @type {String}
     */
    roadNumber: String,
    /**
     * House number of the property
     * @type {String}
     */
    houseNumber: String,
    /**
     * Floor number of the property
     * @type {String}
     */
    floor: String,
    /**
     * Landmark of the property
     * @type {String}
     */
    landmark: String,
    /**
     * Postal code of the property
     * @type {String}
     * @required
     */
    postCode: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{4}$/.test(v);
        },
        message: 'Invalid Bangladesh postal code'
      }
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
    required: true,
    enum: [
      // Residential
      'apartment', 'house', 'flat', 'duplex', 'penthouse',
      // Mess/Hostel
      'male_mess', 'female_mess', 'family_mess',
      'male_hostel', 'female_hostel', 'family_hostel',
      // Bachelor
      'bachelor_male', 'bachelor_female',
      // Sublet
      'sublet_family', 'sublet_bachelor_male', 'sublet_bachelor_female',
      // Commercial
      'office', 'shop', 'warehouse', 'industrial',
      // Other
      'plot', 'other'
    ]
  },
  /**
   * Category of property (Residential, Commercial, Industrial)
   * @type {String}
   * @required
   */
  propertyCategory: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'industrial']
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
       * Electricity information
       * @type {Object}
       */
      electricity: {
        type: String,
        enum: ['included', 'excluded', 'shared'],
        required: true
      },
      /**
       * Water information
       * @type {Object}
       */
      water: {
        type: String,
        enum: ['included', 'excluded', 'shared'],
        required: true
      },
      /**
       * Gas information
       * @type {Object}
       */
      gas: {
        /**
         * Type of gas connection
         * @type {String}
         */
        connection: {
          type: String,
          enum: ['line_connection', 'cylinder', 'none'],
          required: true
        },
        /**
         * Cost of gas
         * @type {String}
         */
        cost: {
          type: String,
          enum: ['included', 'excluded', 'shared']
        }
      },
      /**
       * Internet information
       * @type {Object}
       */
      internet: {
        /**
         * Whether internet is available
         * @type {Boolean}
         */
        available: {
          type: Boolean,
          default: false
        },
        /**
         * Cost of internet
         * @type {String}
         */
        cost: {
          type: String,
          enum: ['included', 'excluded', 'shared']
        }
      }
    },
    /**
     * Amenities available in the property
     * @type {Object}
     */
    amenities: {
      /**
       * Generator information
       * @type {Object}
       */
      generator: {
        /**
         * Whether generator is available
         * @type {Boolean}
         */
        available: Boolean,
        /**
         * Capacity of generator
         * @type {String}
         */
        capacity: String
      },
      /**
       * Lift information
       * @type {Boolean}
       */
      lift: Boolean,
      /**
       * Parking information
       * @type {Object}
       */
      parking: {
        /**
         * Whether parking is available
         * @type {Boolean}
         */
        available: Boolean,
        /**
         * Type of parking
         * @type {String}
         */
        type: {
          type: String,
          enum: ['garage', 'open', 'covered']
        }
      },
      /**
       * Water reservoir information
       * @type {Object}
       */
      waterReservoir: {
        /**
         * Whether water reservoir is available
         * @type {Boolean}
         */
        available: Boolean,
        /**
         * Type of water reservoir
         * @type {String}
         */
        type: {
          type: String,
          enum: ['underground', 'overhead', 'both']
        }
      },
      /**
       * Prayer information
       * @type {Object}
       */
      prayer: {
        /**
         * Mosque information
         * @type {Object}
         */
        mosque: {
          /**
           * Whether mosque is available
           * @type {Boolean}
           */
          available: Boolean,
          /**
           * Distance to mosque
           * @type {Number}
           */
          distance: Number // in meters
        },
        /**
         * Prayer room information
         * @type {Boolean}
         */
        prayerRoom: Boolean
      },
      /**
       * Security information
       * @type {Object}
       */
      security: {
        /**
         * Guard information
         * @type {Boolean}
         */
        guard: Boolean,
        /**
         * CCTV information
         * @type {Boolean}
         */
        cctv: Boolean
      }
    }
  },
  /**
   * Preferences of the property
   * @type {Object}
   */
  preferences: {
    /**
     * Religion preference
     * @type {String}
     */
    religion: {
      type: String,
      enum: ['any', 'muslim', 'hindu', 'christian', 'buddhist', 'other']
    },
    /**
     * Type of tenant preferred
     * @type {Array}
     */
    tenantType: [{
      type: String,
      enum: ['family', 'bachelor', 'student', 'professional']
    }],
    /**
     * Gender preference
     * @type {String}
     */
    gender: {
      type: String,
      enum: ['any', 'male', 'female']
    },
    /**
     * Maximum number of occupants
     * @type {Number}
     */
    maxOccupants: Number
  },
  /**
   * Nearby places of the property
   * @type {Object}
   */
  nearby: {
    /**
     * Education information
     * @type {Array}
     */
    education: [{
      /**
       * Type of education
       * @type {String}
       */
      type: {
        type: String,
        enum: ['school', 'college', 'university', 'madrasa']
      },
      /**
       * Name of education
       * @type {String}
       */
      name: String,
      /**
       * Distance to education
       * @type {Number}
       */
      distance: Number // in meters
    }],
    /**
     * Transport information
     * @type {Array}
     */
    transport: [{
      /**
       * Type of transport
       * @type {String}
       */
      type: {
        type: String,
        enum: ['bus_stop', 'train_station', 'metro_station']
      },
      /**
       * Name of transport
       * @type {String}
       */
      name: String,
      /**
       * Distance to transport
       * @type {Number}
       */
      distance: Number // in meters
    }],
    /**
     * Shopping information
     * @type {Array}
     */
    shopping: [{
      /**
       * Type of shopping
       * @type {String}
       */
      type: {
        type: String,
        enum: ['market', 'shopping_mall', 'grocery']
      },
      /**
       * Name of shopping
       * @type {String}
       */
      name: String,
      /**
       * Distance to shopping
       * @type {Number}
       */
      distance: Number // in meters
    }],
    /**
     * Healthcare information
     * @type {Array}
     */
    healthcare: [{
      /**
       * Type of healthcare
       * @type {String}
       */
      type: {
        type: String,
        enum: ['hospital', 'clinic', 'pharmacy']
      },
      /**
       * Name of healthcare
       * @type {String}
       */
      name: String,
      /**
       * Distance to healthcare
       * @type {Number}
       */
      distance: Number // in meters
    }]
  },
  /**
   * Payment details of the property
   * @type {Object}
   */
  paymentDetails: {
    /**
     * Advance payment information
     * @type {Object}
     */
    advancePayment: {
      /**
       * Number of months for advance payment
       * @type {Number}
       */
      months: {
        type: Number,
        required: true,
        min: 0,
        max: 12
      },
      /**
       * Amount of advance payment
       * @type {Number}
       */
      amount: {
        type: Number,
        required: true
      }
    },
    /**
     * Security deposit information
     * @type {Number}
     */
    securityDeposit: {
      type: Number,
      required: true
    },
    /**
     * Monthly charges information
     * @type {Array}
     */
    monthlyCharges: [{
      /**
       * Type of monthly charge
       * @type {String}
       */
      type: {
        type: String,
        enum: ['service_charge', 'maintenance', 'garbage', 'other']
      },
      /**
       * Amount of monthly charge
       * @type {Number}
       */
      amount: Number,
      /**
       * Description of monthly charge
       * @type {String}
       */
      description: String
    }]
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
