const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const PropertyDocument = require('../models/PropertyDocument');
const UserVerification = require('../models/UserVerification');
const RentalAgreement = require('../models/RentalAgreement');

// @desc    Upload and create property document
// @route   POST /api/v1/documents/property
// @access  Private
exports.uploadPropertyDocument = asyncHandler(async (req, res) => {
  const document = await PropertyDocument.create({
    ...req.body,
    owner: req.user.id
  });

  res.status(201).json({
    success: true,
    data: document
  });
});

// @desc    Verify property document
// @route   PUT /api/v1/documents/property/:id/verify
// @access  Private/Admin
exports.verifyPropertyDocument = asyncHandler(async (req, res) => {
  const document = await PropertyDocument.findById(req.params.id);

  if (!document) {
    throw new ErrorResponse('Document not found', 404);
  }

  document.verificationStatus = req.body.status;
  document.verifiedBy = req.user.id;
  document.verificationDate = Date.now();
  document.rejectionReason = req.body.rejectionReason;
  document.notes = req.body.notes;

  await document.save();

  res.status(200).json({
    success: true,
    data: document
  });
});

// @desc    Upload NID verification documents
// @route   POST /api/v1/documents/nid
// @access  Private
exports.uploadNIDVerification = asyncHandler(async (req, res) => {
  // Check if user already has verification documents
  let verification = await UserVerification.findOne({ user: req.user.id });

  if (verification) {
    throw new ErrorResponse('Verification documents already exist', 400);
  }

  verification = await UserVerification.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: verification
  });
});

// @desc    Verify NID documents
// @route   PUT /api/v1/documents/nid/:id/verify
// @access  Private/Admin
exports.verifyNIDDocuments = asyncHandler(async (req, res) => {
  const verification = await UserVerification.findById(req.params.id);

  if (!verification) {
    throw new ErrorResponse('Verification documents not found', 404);
  }

  verification.verificationStatus = req.body.status;
  verification.verifiedBy = req.user.id;
  verification.verificationDate = Date.now();
  verification.rejectionReason = req.body.rejectionReason;

  await verification.save();

  res.status(200).json({
    success: true,
    data: verification
  });
});

// @desc    Create rental agreement
// @route   POST /api/v1/documents/agreement
// @access  Private
exports.createRentalAgreement = asyncHandler(async (req, res) => {
  const agreement = await RentalAgreement.create({
    ...req.body,
    owner: req.user.id
  });

  res.status(201).json({
    success: true,
    data: agreement
  });
});

// @desc    Update rental agreement status
// @route   PUT /api/v1/documents/agreement/:id
// @access  Private
exports.updateAgreementStatus = asyncHandler(async (req, res) => {
  const agreement = await RentalAgreement.findById(req.params.id);

  if (!agreement) {
    throw new ErrorResponse('Agreement not found', 404);
  }

  // Verify user is owner or tenant
  if (agreement.owner.toString() !== req.user.id && 
      agreement.tenant.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to update this agreement', 403);
  }

  // Handle signatures
  if (req.body.action === 'sign') {
    if (req.user.id === agreement.owner.toString()) {
      agreement.signatures.owner = {
        signed: true,
        date: Date.now()
      };
    } else {
      agreement.signatures.tenant = {
        signed: true,
        date: Date.now()
      };
    }

    // If both parties have signed, update status to active
    if (agreement.signatures.owner.signed && agreement.signatures.tenant.signed) {
      agreement.status = 'active';
    }
  } else {
    // Update other status changes
    agreement.status = req.body.status;
    if (req.body.status === 'terminated') {
      agreement.terminationDate = Date.now();
      agreement.terminationReason = req.body.terminationReason;
    }
  }

  await agreement.save();

  res.status(200).json({
    success: true,
    data: agreement
  });
});

// @desc    Get all documents for a property
// @route   GET /api/v1/documents/property/:propertyId
// @access  Private
exports.getPropertyDocuments = asyncHandler(async (req, res) => {
  const documents = await PropertyDocument.find({ property: req.params.propertyId });

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// @desc    Get user verification status
// @route   GET /api/v1/documents/verification
// @access  Private
exports.getUserVerificationStatus = asyncHandler(async (req, res) => {
  const verification = await UserVerification.findOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: verification
  });
});
