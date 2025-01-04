# Property Management System

## Overview
The property management system handles property listings, updates, availability management, and property-related operations.

## Features
- Property listing creation and management
- Photo upload and management
- Availability calendar
- Pricing management
- Property verification
- Property reviews and ratings
- Property search and filtering
- Property analytics

## Technical Implementation

### Property Service

```javascript
class PropertyService {
  static async createProperty(data, host) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate property data
      await PropertyValidator.validate(data);

      // Create property
      const property = await Property.create({
        title: data.title,
        description: data.description,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude],
          address: data.address,
          city: data.city,
          area: data.area
        },
        propertyType: data.propertyType,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        amenities: data.amenities,
        rules: data.rules,
        pricing: {
          basePrice: data.basePrice,
          cleaningFee: data.cleaningFee,
          extraGuestFee: data.extraGuestFee
        },
        host: host._id,
        status: 'pending'
      });

      // Process and upload images
      if (data.images) {
        const imageUrls = await this.processImages(data.images);
        property.images = imageUrls;
        await property.save();
      }

      await session.commitTransaction();
      return property;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async processImages(images) {
    const processedImages = await Promise.all(
      images.map(async (image) => {
        // Resize image
        const resized = await ImageProcessor.resize(image, {
          width: 1200,
          height: 800,
          fit: 'cover'
        });

        // Upload to cloud storage
        const url = await CloudStorage.upload(
          resized,
          `properties/${Date.now()}-${image.name}`
        );

        return url;
      })
    );

    return processedImages;
  }

  static async updateAvailability(propertyId, dates) {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new PropertyError('Property not found', 'NOT_FOUND');
    }

    property.availability = dates;
    await property.save();

    return property;
  }

  static async updatePricing(propertyId, pricing) {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new PropertyError('Property not found', 'NOT_FOUND');
    }

    property.pricing = {
      ...property.pricing,
      ...pricing
    };
    await property.save();

    return property;
  }
}
```

### Database Schema

```javascript
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'room'],
    required: true
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    enum: [
      'wifi',
      'ac',
      'parking',
      'kitchen',
      'tv',
      'washing_machine',
      'security'
    ]
  }],
  rules: [{
    type: String
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    extraGuestFee: {
      type: Number,
      default: 0
    }
  },
  images: [{
    type: String
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'deleted'],
    default: 'pending'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  availability: [{
    date: Date,
    available: Boolean,
    price: Number
  }]
}, {
  timestamps: true
});

// Indexes
propertySchema.index({ location: '2dsphere' });
propertySchema.index({ title: 'text', description: 'text' });
```

## API Endpoints

### POST /api/properties
Create a new property

Request:
```javascript
{
  title: String,
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    area: String
  },
  propertyType: String,
  rooms: Number,
  bathrooms: Number,
  amenities: [String],
  rules: [String],
  pricing: {
    basePrice: Number,
    cleaningFee: Number,
    extraGuestFee: Number
  },
  images: [File]
}
```

### GET /api/properties/:id
Get property details

Response:
```javascript
{
  id: String,
  title: String,
  description: String,
  location: {
    coordinates: [Number],
    address: String,
    city: String,
    area: String
  },
  propertyType: String,
  rooms: Number,
  bathrooms: Number,
  amenities: [String],
  rules: [String],
  pricing: {
    basePrice: Number,
    cleaningFee: Number,
    extraGuestFee: Number
  },
  images: [String],
  host: {
    id: String,
    name: String,
    rating: Number
  },
  rating: {
    average: Number,
    count: Number
  }
}
```

### PUT /api/properties/:id/availability
Update property availability

Request:
```javascript
{
  dates: [{
    date: Date,
    available: Boolean,
    price: Number
  }]
}
```

## Validation

```javascript
class PropertyValidator {
  static async validate(data) {
    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'location',
      'propertyType',
      'rooms',
      'bathrooms',
      'pricing'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new PropertyError(
          `Missing required field: ${field}`,
          'VALIDATION_ERROR'
        );
      }
    }

    // Validate pricing
    if (data.pricing.basePrice <= 0) {
      throw new PropertyError(
        'Base price must be greater than 0',
        'VALIDATION_ERROR'
      );
    }

    // Validate location
    if (!this.isValidLocation(data.location)) {
      throw new PropertyError(
        'Invalid location coordinates',
        'VALIDATION_ERROR'
      );
    }

    return true;
  }

  static isValidLocation(location) {
    return (
      location.latitude >= -90 &&
      location.latitude <= 90 &&
      location.longitude >= -180 &&
      location.longitude <= 180
    );
  }
}
```

## Image Processing

```javascript
class ImageProcessor {
  static async resize(image, options) {
    return await sharp(image.buffer)
      .resize(options.width, options.height, {
        fit: options.fit,
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  static async generateThumbnail(image) {
    return await sharp(image.buffer)
      .resize(300, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 60 })
      .toBuffer();
  }
}
```

## Analytics

```javascript
class PropertyAnalytics {
  static async trackView(propertyId, userId) {
    await PropertyView.create({
      property: propertyId,
      user: userId,
      timestamp: new Date()
    });
  }

  static async getViewStats(propertyId, period) {
    const stats = await PropertyView.aggregate([
      {
        $match: {
          property: mongoose.Types.ObjectId(propertyId),
          timestamp: {
            $gte: new Date(Date.now() - period)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          views: { $sum: 1 }
        }
      }
    ]);

    return stats;
  }
}
```

## Testing

```javascript
describe('Property Service', () => {
  it('should create property', async () => {
    const property = await PropertyService.createProperty({
      title: 'Test Property',
      description: 'Test Description',
      location: {
        latitude: 23.8103,
        longitude: 90.4125,
        address: 'Test Address',
        city: 'Dhaka',
        area: 'Gulshan'
      },
      propertyType: 'apartment',
      rooms: 2,
      bathrooms: 2,
      pricing: {
        basePrice: 1000
      }
    }, hostUser);

    expect(property).toHaveProperty('_id');
    expect(property.status).toBe('pending');
  });

  it('should validate property data', async () => {
    await expect(
      PropertyValidator.validate({
        // Invalid data
      })
    ).rejects.toThrow('VALIDATION_ERROR');
  });
});
```

## Error Handling

```javascript
class PropertyError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function handlePropertyError(error) {
  await PropertyErrorLog.create({
    code: error.code,
    message: error.message,
    timestamp: new Date()
  });

  return {
    error: true,
    code: error.code,
    message: error.message
  };
}
```
