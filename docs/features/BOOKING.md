# Booking System

## Overview
The booking system manages property reservations, including availability checking, booking creation, modification, and cancellation.

## Features
- Real-time availability checking
- Instant booking
- Booking modification
- Cancellation management
- Payment integration
- Booking history
- Host approval workflow
- Guest limits enforcement

## Technical Implementation

### Booking Service

```javascript
class BookingService {
  static async createBooking(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check property availability
      const isAvailable = await this.checkAvailability(
        data.propertyId,
        data.startDate,
        data.endDate
      );
      
      if (!isAvailable) {
        throw new BookingError(
          'Property not available for selected dates',
          'UNAVAILABLE'
        );
      }

      // Calculate total amount
      const totalAmount = await this.calculateTotalAmount(
        data.propertyId,
        data.startDate,
        data.endDate,
        data.guests
      );

      // Create booking
      const booking = await Booking.create({
        property: data.propertyId,
        guest: data.guestId,
        startDate: data.startDate,
        endDate: data.endDate,
        guests: data.guests,
        totalAmount,
        status: 'pending'
      });

      // Create initial payment
      await PaymentService.createPayment({
        bookingId: booking._id,
        amount: totalAmount,
        method: data.paymentMethod
      });

      await session.commitTransaction();
      return booking;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async checkAvailability(propertyId, startDate, endDate) {
    const overlappingBookings = await Booking.find({
      property: propertyId,
      status: { $nin: ['cancelled', 'rejected'] },
      $or: [
        {
          startDate: { $lte: startDate },
          endDate: { $gte: startDate }
        },
        {
          startDate: { $lte: endDate },
          endDate: { $gte: endDate }
        }
      ]
    });

    return overlappingBookings.length === 0;
  }

  static async calculateTotalAmount(propertyId, startDate, endDate, guests) {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new BookingError('Property not found', 'NOT_FOUND');
    }

    const nights = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    let amount = property.basePrice * nights;

    // Add guest fee if applicable
    if (guests > property.baseGuests) {
      amount += property.extraGuestFee * (guests - property.baseGuests) * nights;
    }

    // Add cleaning fee
    amount += property.cleaningFee;

    return amount;
  }
}
```

### Database Schema

```javascript
const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  cancellationReason: String,
  specialRequests: String,
  checkInTime: Date,
  checkOutTime: Date,
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});
```

## API Endpoints

### POST /api/bookings/create
Create a new booking

Request:
```javascript
{
  propertyId: String,
  startDate: Date,
  endDate: Date,
  guests: Number,
  paymentMethod: String,
  specialRequests: String
}
```

Response:
```javascript
{
  bookingId: String,
  totalAmount: Number,
  status: String,
  paymentUrl: String
}
```

### GET /api/bookings/:id
Get booking details

Response:
```javascript
{
  id: String,
  property: {
    id: String,
    title: String,
    address: String
  },
  dates: {
    start: Date,
    end: Date
  },
  guests: Number,
  amount: Number,
  status: String,
  paymentStatus: String
}
```

### PUT /api/bookings/:id/cancel
Cancel a booking

Request:
```javascript
{
  reason: String
}
```

## Validation

```javascript
class BookingValidator {
  static validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      throw new BookingError(
        'Start date cannot be in the past',
        'INVALID_DATES'
      );
    }

    if (end <= start) {
      throw new BookingError(
        'End date must be after start date',
        'INVALID_DATES'
      );
    }

    return true;
  }

  static validateGuests(guests, property) {
    if (guests < 1) {
      throw new BookingError(
        'Number of guests must be at least 1',
        'INVALID_GUESTS'
      );
    }

    if (guests > property.maxGuests) {
      throw new BookingError(
        'Number of guests exceeds property capacity',
        'INVALID_GUESTS'
      );
    }

    return true;
  }
}
```

## Notifications

```javascript
class BookingNotifications {
  static async sendBookingConfirmation(booking) {
    await NotificationService.send({
      type: 'BOOKING_CONFIRMATION',
      recipient: booking.guest,
      data: {
        bookingId: booking._id,
        propertyTitle: booking.property.title,
        dates: {
          start: booking.startDate,
          end: booking.endDate
        }
      }
    });
  }

  static async sendHostNotification(booking) {
    await NotificationService.send({
      type: 'NEW_BOOKING_REQUEST',
      recipient: booking.property.host,
      data: {
        bookingId: booking._id,
        guestName: booking.guest.name,
        dates: {
          start: booking.startDate,
          end: booking.endDate
        }
      }
    });
  }
}
```

## Error Handling

```javascript
class BookingError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function handleBookingError(error) {
  await BookingErrorLog.create({
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

## Testing

```javascript
describe('Booking Service', () => {
  it('should create booking', async () => {
    const booking = await BookingService.createBooking({
      propertyId: 'propertyId',
      guestId: 'guestId',
      startDate: '2025-02-01',
      endDate: '2025-02-05',
      guests: 2
    });

    expect(booking).toHaveProperty('_id');
    expect(booking.status).toBe('pending');
  });

  it('should check availability', async () => {
    const isAvailable = await BookingService.checkAvailability(
      'propertyId',
      '2025-02-01',
      '2025-02-05'
    );

    expect(isAvailable).toBe(true);
  });
});
```

## Monitoring

```javascript
class BookingMonitor {
  static async trackBooking(booking) {
    await BookingMetrics.create({
      propertyId: booking.property,
      duration: booking.endDate - booking.startDate,
      guests: booking.guests,
      amount: booking.totalAmount,
      timestamp: new Date()
    });
  }

  static async logBookingEvent(booking, event) {
    await BookingLog.create({
      bookingId: booking._id,
      event,
      timestamp: new Date()
    });
  }
}
```
