const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const RentalAgreement = require('../models/RentalAgreement');
const axios = require('axios');

// Utility function to get payment gateway credentials
const getPaymentGatewayConfig = (gateway) => {
  const configs = {
    bkash: {
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
      username: process.env.BKASH_USERNAME,
      password: process.env.BKASH_PASSWORD,
      baseURL: process.env.BKASH_BASE_URL
    },
    nagad: {
      merchant_id: process.env.NAGAD_MERCHANT_ID,
      merchant_number: process.env.NAGAD_MERCHANT_NUMBER,
      public_key: process.env.NAGAD_PUBLIC_KEY,
      private_key: process.env.NAGAD_PRIVATE_KEY,
      baseURL: process.env.NAGAD_BASE_URL
    },
    rocket: {
      merchant_id: process.env.ROCKET_MERCHANT_ID,
      secret_key: process.env.ROCKET_SECRET_KEY,
      baseURL: process.env.ROCKET_BASE_URL
    }
  };
  return configs[gateway];
};

// @desc    Initialize payment
// @route   POST /api/v1/payments/initialize
// @access  Private
exports.initializePayment = asyncHandler(async (req, res) => {
  const { amount, gateway, propertyId, paymentType } = req.body;

  // Validate property and get details
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  // Get gateway configuration
  const gatewayConfig = getPaymentGatewayConfig(gateway);
  if (!gatewayConfig) {
    throw new ErrorResponse('Invalid payment gateway', 400);
  }

  let paymentResponse;
  
  // Handle different payment gateways
  switch (gateway) {
    case 'bkash':
      paymentResponse = await initializeBkashPayment(amount, gatewayConfig);
      break;
    case 'nagad':
      paymentResponse = await initializeNagadPayment(amount, gatewayConfig);
      break;
    case 'rocket':
      paymentResponse = await initializeRocketPayment(amount, gatewayConfig);
      break;
    default:
      throw new ErrorResponse('Unsupported payment gateway', 400);
  }

  // Create payment record
  const payment = await Payment.create({
    user: req.user.id,
    property: propertyId,
    amount,
    gateway,
    paymentType,
    transactionId: paymentResponse.transactionId,
    status: 'pending'
  });

  res.status(200).json({
    success: true,
    data: {
      paymentId: payment._id,
      gatewayResponse: paymentResponse
    }
  });
});

// @desc    Execute payment callback
// @route   POST /api/v1/payments/callback/:gateway
// @access  Public
exports.paymentCallback = asyncHandler(async (req, res) => {
  const { gateway } = req.params;
  const gatewayConfig = getPaymentGatewayConfig(gateway);

  let verificationResponse;
  switch (gateway) {
    case 'bkash':
      verificationResponse = await verifyBkashPayment(req.body, gatewayConfig);
      break;
    case 'nagad':
      verificationResponse = await verifyNagadPayment(req.body, gatewayConfig);
      break;
    case 'rocket':
      verificationResponse = await verifyRocketPayment(req.body, gatewayConfig);
      break;
    default:
      throw new ErrorResponse('Unsupported payment gateway', 400);
  }

  // Update payment record
  const payment = await Payment.findOneAndUpdate(
    { transactionId: verificationResponse.transactionId },
    {
      status: verificationResponse.status,
      paymentDetails: verificationResponse
    },
    { new: true }
  );

  if (!payment) {
    throw new ErrorResponse('Payment record not found', 404);
  }

  // If payment successful, update related records
  if (verificationResponse.status === 'completed') {
    await updateRelatedRecords(payment);
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Get payment history
// @route   GET /api/v1/payments/history
// @access  Private
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user.id })
    .populate('property', 'title address')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc    Get payment details
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('property', 'title address')
    .populate('user', 'name email');

  if (!payment) {
    throw new ErrorResponse('Payment not found', 404);
  }

  // Check if user is authorized to view payment
  if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to view this payment', 403);
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// Helper functions for different payment gateways
async function initializeBkashPayment(amount, config) {
  try {
    const response = await axios.post(`${config.baseURL}/checkout/payment/create`, {
      amount,
      currency: 'BDT',
      merchantInvoiceNumber: 'INV' + Date.now()
    }, {
      headers: {
        'Authorization': config.app_key,
        'X-APP-Key': config.app_key
      }
    });

    return {
      transactionId: response.data.paymentID,
      redirectURL: response.data.bkashURL
    };
  } catch (error) {
    throw new ErrorResponse('bKash payment initialization failed', 500);
  }
}

async function initializeNagadPayment(amount, config) {
  // Implementation for Nagad payment initialization
  // Similar to bKash but with Nagad-specific API calls
}

async function initializeRocketPayment(amount, config) {
  // Implementation for Rocket payment initialization
  // Similar to bKash but with Rocket-specific API calls
}

async function verifyBkashPayment(payload, config) {
  try {
    const response = await axios.post(`${config.baseURL}/checkout/payment/execute`,
      { paymentID: payload.paymentID },
      {
        headers: {
          'Authorization': config.app_key,
          'X-APP-Key': config.app_key
        }
      }
    );

    return {
      transactionId: payload.paymentID,
      status: response.data.transactionStatus === 'Completed' ? 'completed' : 'failed',
      paymentDetails: response.data
    };
  } catch (error) {
    throw new ErrorResponse('bKash payment verification failed', 500);
  }
}

async function verifyNagadPayment(payload, config) {
  // Implementation for Nagad payment verification
}

async function verifyRocketPayment(payload, config) {
  // Implementation for Rocket payment verification
}

async function updateRelatedRecords(payment) {
  // Update related records based on payment type
  switch (payment.paymentType) {
    case 'rent':
      await updateRentPayment(payment);
      break;
    case 'advance':
      await updateAdvancePayment(payment);
      break;
    case 'security_deposit':
      await updateSecurityDeposit(payment);
      break;
    // Add other payment types as needed
  }
}

async function updateRentPayment(payment) {
  // Update rent payment records
  const agreement = await RentalAgreement.findOne({
    property: payment.property,
    tenant: payment.user,
    status: 'active'
  });

  if (agreement) {
    // Update rent payment history
    agreement.rentPayments.push({
      amount: payment.amount,
      paymentDate: payment.createdAt,
      transactionId: payment.transactionId
    });
    await agreement.save();
  }
}
