const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { catchAsync, NotFoundError, ValidationError } = require('../utils/errorHandler');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = catchAsync(async (req, res) => {
  try {
    const { property, startDate, endDate, totalAmount } = req.body;
    const tenantId = req.user.id;

    // Get property and check if it exists
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      throw new NotFoundError('Property not found');
    }

    // Check if property is available for the requested dates
    const isAvailable = await Booking.checkAvailability(
      propertyDoc._id,
      new Date(startDate),
      new Date(endDate)
    );

    if (!isAvailable) {
      throw new ValidationError('Property is not available for these dates');
    }

    // Create booking
    const booking = await Booking.create({
      property: propertyDoc._id,
      tenant: tenantId,
      owner: propertyDoc.owner,
      startDate,
      endDate,
      totalAmount: totalAmount || 0,
      status: 'pending'
    });

    // Calculate total amount if not provided
    if (!totalAmount) {
      await booking.calculateTotalAmount();
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking. Please try again later.',
      error: error.message
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = catchAsync(async (req, res) => {
  let query;

  // If user is tenant, get only their bookings
  if (req.user.role === 'tenant') {
    query = Booking.find({ tenant: req.user.id });
  }
  // If user is owner, get only bookings for their properties
  else if (req.user.role === 'owner') {
    query = Booking.find({ owner: req.user.id });
  }
  // If admin, get all bookings
  else {
    query = Booking.find();
  }

  const bookings = await query
    .populate({
      path: 'property',
      select: 'title location images'
    })
    .populate({
      path: 'tenant',
      select: 'name email phone'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'property',
      select: 'title location images'
    })
    .populate({
      path: 'tenant',
      select: 'name email phone'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is booking owner or property owner
  if (
    booking.tenant.toString() !== req.user.id &&
    booking.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to access this booking');
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = catchAsync(async (req, res) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is booking tenant
  if (
    booking.tenant.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to update this booking');
  }

  // If dates are being updated, check availability
  if (req.body.startDate || req.body.endDate) {
    const isAvailable = await Booking.checkAvailability(
      booking.property,
      new Date(req.body.startDate || booking.startDate),
      new Date(req.body.endDate || booking.endDate),
      booking._id
    );

    if (!isAvailable) {
      throw new ValidationError('Property is not available for these dates');
    }
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is booking tenant or admin
  if (
    booking.tenant.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to delete this booking');
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is property owner or admin
  if (
    booking.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to update booking status');
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Add booking message
// @route   POST /api/bookings/:id/messages
// @access  Private
exports.addBookingMessage = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is booking owner or property owner
  if (
    booking.tenant.toString() !== req.user.id &&
    booking.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to add messages to this booking');
  }

  booking.messages.push({
    sender: req.user.id,
    message: req.body.message
  });

  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Get booking messages
// @route   GET /api/bookings/:id/messages
// @access  Private
exports.getBookingMessages = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'messages.sender',
      select: 'name'
    });

  if (!booking) {
    throw new NotFoundError(`Booking not found with id of ${req.params.id}`);
  }

  // Make sure user is booking owner or property owner
  if (
    booking.tenant.toString() !== req.user.id &&
    booking.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ValidationError('Not authorized to view messages');
  }

  res.status(200).json({
    success: true,
    data: booking.messages
  });
});
