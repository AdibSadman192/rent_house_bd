const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    },
    address: {
      street: String,
      area: String,
      city: String,
      district: String,
      division: String,
      postalCode: String
    },
    formattedAddress: String
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'BDT',
      enum: ['BDT']
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'House', 'Room', 'Hostel', 'Mess', 'Sublet', 'Shared Apartment']
  },
  amenities: [{
    type: String,
    enum: [
      'Furnished',
      'AC',
      'Hot Water',
      'Parking',
      'Security',
      'CCTV',
      'Generator',
      'Elevator',
      'Internet',
      'Gas',
      'Water',
      'Garden',
      'Servant Quarter',
      'Garage',
      'Study Room',
      'Study Table',
      'Common Room',
      'Gym'
    ]
  }],
  preferences: {
    gender: {
      type: String,
      enum: ['Any', 'Male', 'Female'],
      default: 'Any'
    },
    tenantType: {
      type: String,
      enum: ['Any', 'Family', 'Bachelor', 'Student', 'Professional'],
      default: 'Any'
    },
    maxOccupants: Number
  },
  availability: {
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Unavailable'],
      default: 'Available'
    },
    availableFrom: Date,
    minimumStay: {
      type: Number,
      default: 1 // in months
    }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an owner']
  },
  stats: {
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  approved: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
postSchema.index({ ownerId: 1, createdAt: -1 });
postSchema.index({ approved: 1, active: 1, createdAt: -1 });
postSchema.index({ 'location.coordinates': '2dsphere' });
postSchema.index({ 
  'location.address.area': 'text',
  'location.address.city': 'text',
  title: 'text',
  description: 'text'
});

// Populate owner details when querying posts
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'ownerId',
    select: 'name email phone avatar'
  });
  next();
});

// Update stats
postSchema.methods.updateStats = async function() {
  const savedCount = await mongoose.model('SavedPost').countDocuments({ postId: this._id });
  const inquiryCount = await mongoose.model('Message').countDocuments({ 
    postId: this._id,
    type: 'inquiry'
  });
  
  this.stats.saves = savedCount;
  this.stats.inquiries = inquiryCount;
  return this.save();
};

// Get nearby posts
postSchema.statics.getNearby = async function(coordinates, maxDistance = 5000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    approved: true,
    active: true
  });
};

module.exports = mongoose.model('Post', postSchema);
