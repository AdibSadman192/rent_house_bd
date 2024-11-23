const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    houseNumber: {
      type: String,
      required: [true, 'Please add a house number']
    },
    floor: {
      type: Number,
      required: [true, 'Please specify the floor number'],
      min: [0, 'Floor number cannot be negative']
    },
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
    district: {
      type: String,
      required: [true, 'Please add a district'],
      index: true
    },
    thana: {
      type: String,
      required: [true, 'Please add a thana/upazila'],
      index: true
    },
    area: {
      type: String,
      required: [true, 'Please add an area']
    },
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
    country: {
      type: String,
      default: 'Bangladesh',
      required: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
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
  price: {
    amount: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
      index: true
    },
    currency: {
      type: String,
      default: 'BDT',
      enum: ['BDT']
    },
    negotiable: {
      type: Boolean,
      default: false
    },
    advancePayment: {
      type: Number,
      required: [true, 'Please specify advance payment amount'],
      min: [0, 'Advance payment cannot be negative']
    }
  },
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
  status: {
    type: String,
    enum: {
      values: ['available', 'rented', 'maintenance', 'inactive'],
      message: '{VALUE} is not supported'
    },
    default: 'available',
    index: true
  },
  features: {
    size: {
      value: {
        type: Number,
        required: [true, 'Please specify the size'],
        min: [0, 'Size cannot be negative']
      },
      unit: {
        type: String,
        enum: ['sqft', 'katha', 'bigha'],
        default: 'sqft'
      }
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [0, 'Number of bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [0, 'Number of bathrooms cannot be negative']
    },
    balconies: {
      type: Number,
      default: 0,
      min: [0, 'Number of balconies cannot be negative']
    },
    parking: {
      available: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        enum: ['car', 'bike', 'both', 'none'],
        default: 'none'
      }
    },
    furnished: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    },
    utilities: {
      electricity: {
        type: Boolean,
        default: true
      },
      gas: {
        type: Boolean,
        default: false
      },
      water: {
        type: Boolean,
        default: true
      },
      internet: {
        type: Boolean,
        default: false
      },
      maintenance: {
        type: Boolean,
        default: false
      }
    },
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
  preferences: {
    tenantType: [{
      type: String,
      enum: ['family', 'bachelor', 'office', 'student', 'any'],
      default: ['any']
    }],
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    maxOccupants: {
      type: Number,
      min: [1, 'Maximum occupants must be at least 1']
    },
    petsAllowed: {
      type: Boolean,
      default: false
    }
  },
  images: [{
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
    alt: {
      type: String,
      default: 'Property image'
    }
  }],
  virtualTour: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
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
