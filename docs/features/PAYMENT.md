# Payment System

## Overview
The payment system handles all financial transactions including rent payments, security deposits, and refunds.

## Features
- Multiple payment methods (bKash, Nagad, Bank Transfer)
- Automatic rent collection
- Security deposit management
- Payment history
- Invoice generation
- Refund processing
- Payment reminders

## Technical Implementation

### Payment Gateway Integration

```javascript
// Payment Gateway Configuration
const paymentConfig = {
  bkash: {
    merchantId: process.env.BKASH_MERCHANT_ID,
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET,
    sandbox: process.env.NODE_ENV !== 'production'
  },
  nagad: {
    merchantId: process.env.NAGAD_MERCHANT_ID,
    publicKey: process.env.NAGAD_PUBLIC_KEY,
    privateKey: process.env.NAGAD_PRIVATE_KEY,
    sandbox: process.env.NODE_ENV !== 'production'
  }
};

// Payment Service
class PaymentService {
  static async createPayment(bookingId, amount, method) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    const payment = await Payment.create({
      booking: bookingId,
      amount,
      method,
      status: 'pending'
    });

    switch (method) {
      case 'bkash':
        return await this.initiateBkashPayment(payment);
      case 'nagad':
        return await this.initiateNagadPayment(payment);
      default:
        throw new Error('Invalid payment method');
    }
  }

  static async verifyPayment(paymentId, transactionId) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    const verified = await this.verifyWithGateway(
      payment.method,
      transactionId
    );

    if (verified) {
      payment.status = 'completed';
      payment.transactionId = transactionId;
      await payment.save();

      await this.updateBookingStatus(payment.booking);
    }

    return payment;
  }
}
```

### Database Schema

```javascript
// Payment Schema
const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['bkash', 'nagad', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  gatewayResponse: Object,
  refundDetails: {
    amount: Number,
    reason: String,
    processedAt: Date
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});
```

## API Endpoints

### POST /api/payments/create
Create a new payment

Request:
```javascript
{
  bookingId: String,
  amount: Number,
  method: String,
  currency: String
}
```

Response:
```javascript
{
  paymentId: String,
  gatewayUrl: String,
  amount: Number,
  status: String
}
```

### POST /api/payments/verify
Verify payment completion

Request:
```javascript
{
  paymentId: String,
  transactionId: String
}
```

### GET /api/payments/history
Get payment history

Response:
```javascript
{
  payments: [{
    id: String,
    amount: Number,
    method: String,
    status: String,
    createdAt: Date,
    booking: {
      id: String,
      property: {
        id: String,
        title: String
      }
    }
  }],
  total: Number,
  page: Number
}
```

## Security Measures

1. Payment Data Security
```javascript
class PaymentSecurity {
  static encryptPaymentData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decryptPaymentData(encrypted) {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
```

2. Transaction Verification
```javascript
class TransactionVerifier {
  static async verify(payment) {
    // Verify payment signature
    const isValid = this.verifySignature(
      payment.signature,
      payment.data
    );

    // Verify amount matches
    const amountMatches = this.verifyAmount(
      payment.amount,
      payment.booking
    );

    return isValid && amountMatches;
  }
}
```

## Error Handling

```javascript
class PaymentError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

async function handlePaymentError(error) {
  if (error instanceof PaymentError) {
    await PaymentErrorLog.create({
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date()
    });

    return {
      error: true,
      code: error.code,
      message: error.message
    };
  }

  return {
    error: true,
    code: 'PAYMENT_ERROR',
    message: 'An error occurred during payment processing'
  };
}
```

## Monitoring and Logging

```javascript
class PaymentMonitor {
  static async logTransaction(payment) {
    await PaymentLog.create({
      paymentId: payment._id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      timestamp: new Date()
    });
  }

  static async trackMetrics(payment) {
    await PaymentMetrics.create({
      method: payment.method,
      amount: payment.amount,
      processingTime: payment.processingTime,
      successful: payment.status === 'completed',
      timestamp: new Date()
    });
  }
}
```

## Testing

```javascript
describe('Payment Service', () => {
  it('should create payment', async () => {
    const payment = await PaymentService.createPayment(
      'bookingId',
      1000,
      'bkash'
    );
    expect(payment).toHaveProperty('id');
    expect(payment.status).toBe('pending');
  });

  it('should verify payment', async () => {
    const verified = await PaymentService.verifyPayment(
      'paymentId',
      'transactionId'
    );
    expect(verified.status).toBe('completed');
  });
});
```

## Deployment Considerations

1. Environment Variables
```bash
# Payment Gateway Credentials
BKASH_MERCHANT_ID=xxx
BKASH_APP_KEY=xxx
BKASH_APP_SECRET=xxx
NAGAD_MERCHANT_ID=xxx
NAGAD_PUBLIC_KEY=xxx
NAGAD_PRIVATE_KEY=xxx

# Security
ENCRYPTION_KEY=xxx
PAYMENT_WEBHOOK_SECRET=xxx

# Monitoring
PAYMENT_MONITORING_ENABLED=true
PAYMENT_LOG_LEVEL=info
```

2. SSL Configuration
```javascript
const paymentServer = https.createServer({
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
}, app);
```
