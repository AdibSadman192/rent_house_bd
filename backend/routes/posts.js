const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Renters only)
router.post(
  '/',
  protect,
  authorize('renter'),
  asyncHandler(async (req, res) => {
    // Add user id to request body
    req.body.ownerId = req.user.id;

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  })
);

// @desc    Get all approved posts
// @route   GET /api/posts
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Build query
    const query = {
      approved: true
    };

    // Add search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Add location filter
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Add price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments(query);

    // Execute query
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts
    });
  })
);

// @desc    Approve or disapprove a post
// @route   PUT /api/posts/approve/:id
// @access  Private (Admin only)
router.put(
  '/approve/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Please provide approved status as boolean'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    post.approved = approved;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  })
);

// Additional useful routes

// @desc    Get posts by current user
// @route   GET /api/posts/me
// @access  Private
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const posts = await Post.find({ ownerId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  })
);

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Post owner or Admin)
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }

    // Don't allow updating the approval status through this route
    delete req.body.approved;

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  })
);

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Post owner or Admin)
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }

    await post.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  })
);

module.exports = router;
