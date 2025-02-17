const RentalAgreement = require('../models/RentalAgreement');
const Property = require('../models/Property');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Generate a new rental agreement
exports.generateAgreement = asyncHandler(async (req, res, next) => {
  const {
    propertyId,
    tenantId,
    agreementType,
    agreementLanguage,
    startDate,
    endDate,
    rentAmount,
    securityDeposit,
    advancePayment,
    utilities,
    monthlyCharges,
    specialConditions,
    noticeRequired,
    witnesses
  } = req.body;

  // Validate required fields
  if (!propertyId || !tenantId || !startDate || !endDate || !rentAmount) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) {
    return next(new ErrorResponse('End date must be after start date', 400));
  }

  // Verify property exists and user owns it
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }
  if (property.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to generate agreement for this property', 403));
  }

  // Verify tenant exists
  const tenant = await User.findById(tenantId);
  if (!tenant) {
    return next(new ErrorResponse('Tenant not found', 404));
  }

  // Validate financial details
  if (rentAmount <= 0 || (securityDeposit && securityDeposit < 0) || (advancePayment && advancePayment < 0)) {
    return next(new ErrorResponse('Invalid financial details', 400));
  }

  // Create rental agreement
  const agreement = await RentalAgreement.create({
    property: propertyId,
    owner: req.user.id,
    tenant: tenantId,
    agreementType,
    agreementLanguage,
    startDate,
    endDate,
    rentAmount,
    securityDeposit,
    advancePayment,
    utilities,
    monthlyCharges,
    specialConditions,
    noticeRequired,
    witnesses,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: agreement
  });
});

// Get all agreements for a user (as owner or tenant)
exports.getAgreements = asyncHandler(async (req, res, next) => {
  const agreements = await RentalAgreement.find({
    $or: [
      { owner: req.user.id },
      { tenant: req.user.id }
    ]
  }).populate('property owner tenant');

  res.status(200).json({
    success: true,
    count: agreements.length,
    data: agreements
  });
});

// Get single agreement
exports.getAgreement = asyncHandler(async (req, res, next) => {
  const agreement = await RentalAgreement.findById(req.params.id)
    .populate('property owner tenant');

  if (!agreement) {
    return next(new ErrorResponse('Agreement not found', 404));
  }

  // Check if user is authorized to view this agreement
  if (agreement.owner.toString() !== req.user.id && 
      agreement.tenant.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this agreement', 403));
  }

  res.status(200).json({
    success: true,
    data: agreement
  });
});

// Update agreement status (sign/reject)
exports.updateAgreementStatus = asyncHandler(async (req, res, next) => {
  const { status, signature } = req.body;

  // Validate status
  if (!['signed', 'rejected'].includes(status)) {
    return next(new ErrorResponse('Invalid status. Status must be either signed or rejected', 400));
  }
  
  let agreement = await RentalAgreement.findById(req.params.id);
  if (!agreement) {
    return next(new ErrorResponse('Agreement not found', 404));
  }

  // Check if agreement is already processed
  if (agreement.status !== 'pending') {
    return next(new ErrorResponse('Agreement has already been processed', 400));
  }

  // Only tenant can sign/reject the agreement
  if (agreement.tenant.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this agreement', 403));
  }

  // Require signature for signing
  if (status === 'signed' && !signature) {
    return next(new ErrorResponse('Signature is required to sign the agreement', 400));
  }

  agreement = await RentalAgreement.findByIdAndUpdate(
    req.params.id,
    { 
      status,
      'signatures.tenant': signature,
      'signatures.signedAt': Date.now()
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: agreement
  });
});