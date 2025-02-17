const Group = require('../models/Group');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = asyncHandler(async (req, res) => {
  const { name, description, type, location, rules, isPrivate } = req.body;

  const group = await Group.create({
    name,
    description,
    type,
    location,
    rules,
    isPrivate,
    creator: req.user.id,
    members: [req.user.id],
    admins: [req.user.id]
  });

  res.status(201).json({
    success: true,
    data: group
  });
});

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
exports.getGroups = asyncHandler(async (req, res) => {
  const { type, search, near } = req.query;
  const query = {};

  // Filter by type
  if (type) {
    query.type = type;
  }

  // Search by name or description
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by location
  if (near) {
    const [lng, lat] = near.split(',').map(Number);
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: 10000 // 10km
      }
    };
  }

  const groups = await Group.find(query)
    .populate('creator', 'name avatar')
    .populate('members', 'name avatar')
    .select('-__v');

  res.status(200).json({
    success: true,
    count: groups.length,
    data: groups
  });
});

// @desc    Get group members
// @route   GET /api/groups/:id/members
// @access  Private
exports.getGroupMembers = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('members', 'name avatar email')
    .select('members');

  if (!group) {
    throw new ErrorResponse(`Group not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: group.members
  });
});

// @desc    Join a group
// @route   POST /api/groups/:id/join
// @access  Private
exports.joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new ErrorResponse(`Group not found with id of ${req.params.id}`, 404);
  }

  // Check if user is already a member
  if (group.isMember(req.user.id)) {
    throw new ErrorResponse('User is already a member of this group', 400);
  }

  // Add user to members array
  group.members.push(req.user.id);
  await group.save();

  res.status(200).json({
    success: true,
    data: group
  });
});

// @desc    Leave a group
// @route   DELETE /api/groups/:id/leave
// @access  Private
exports.leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new ErrorResponse(`Group not found with id of ${req.params.id}`, 404);
  }

  // Check if user is a member
  if (!group.isMember(req.user.id)) {
    throw new ErrorResponse('User is not a member of this group', 400);
  }

  // Remove user from members array
  group.members = group.members.filter(
    member => member.toString() !== req.user.id
  );
  await group.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});