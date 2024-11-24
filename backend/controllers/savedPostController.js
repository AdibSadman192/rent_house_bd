const SavedPost = require('../models/SavedPost');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Save a post
// @route   POST /api/v1/saved-posts
// @access  Private
exports.savePost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  // Check if post exists
  const post = await Post.findById(req.body.postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.body.postId}`, 404));
  }

  // Check if post is already saved
  const existingSave = await SavedPost.findOne({
    userId: req.user.id,
    postId: req.body.postId
  });

  if (existingSave) {
    return next(new ErrorResponse('Post already saved', 400));
  }

  const savedPost = await SavedPost.create(req.body);

  res.status(201).json({
    success: true,
    data: savedPost
  });
});

// @desc    Get all saved posts for a user
// @route   GET /api/v1/saved-posts
// @access  Private
exports.getSavedPosts = asyncHandler(async (req, res, next) => {
  const savedPosts = await SavedPost.find({ userId: req.user.id })
    .populate({
      path: 'postId',
      select: 'title description location price images propertyType amenities'
    });

  res.status(200).json({
    success: true,
    count: savedPosts.length,
    data: savedPosts
  });
});

// @desc    Get single saved post
// @route   GET /api/v1/saved-posts/:id
// @access  Private
exports.getSavedPost = asyncHandler(async (req, res, next) => {
  const savedPost = await SavedPost.findById(req.params.id)
    .populate({
      path: 'postId',
      select: 'title description location price images propertyType amenities'
    });

  if (!savedPost) {
    return next(new ErrorResponse(`Saved post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns saved post
  if (savedPost.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this saved post', 401));
  }

  res.status(200).json({
    success: true,
    data: savedPost
  });
});

// @desc    Update saved post
// @route   PUT /api/v1/saved-posts/:id
// @access  Private
exports.updateSavedPost = asyncHandler(async (req, res, next) => {
  let savedPost = await SavedPost.findById(req.params.id);

  if (!savedPost) {
    return next(new ErrorResponse(`Saved post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns saved post
  if (savedPost.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this saved post', 401));
  }

  savedPost = await SavedPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: savedPost
  });
});

// @desc    Delete saved post
// @route   DELETE /api/v1/saved-posts/:id
// @access  Private
exports.deleteSavedPost = asyncHandler(async (req, res, next) => {
  const savedPost = await SavedPost.findById(req.params.id);

  if (!savedPost) {
    return next(new ErrorResponse(`Saved post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns saved post
  if (savedPost.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this saved post', 401));
  }

  await savedPost.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's collections
// @route   GET /api/v1/saved-posts/collections
// @access  Private
exports.getCollections = asyncHandler(async (req, res, next) => {
  const collections = await SavedPost.aggregate([
    { $match: { userId: req.user._id } },
    { $unwind: "$collections" },
    { $group: { _id: "$collections", count: { $sum: 1 } } },
    { $project: { name: "$_id", count: 1, _id: 0 } },
    { $sort: { name: 1 } }
  ]);

  res.status(200).json({
    success: true,
    count: collections.length,
    data: collections
  });
});

// @desc    Get posts in a collection
// @route   GET /api/v1/saved-posts/collections/:name
// @access  Private
exports.getPostsByCollection = asyncHandler(async (req, res, next) => {
  const savedPosts = await SavedPost.find({
    userId: req.user.id,
    collections: req.params.name
  }).populate({
    path: 'postId',
    select: 'title description location price images propertyType amenities'
  });

  res.status(200).json({
    success: true,
    count: savedPosts.length,
    data: savedPosts
  });
});

// @desc    Add post to collection
// @route   PUT /api/v1/saved-posts/:id/collections
// @access  Private
exports.addToCollection = asyncHandler(async (req, res, next) => {
  const { collections } = req.body;
  
  if (!collections || !Array.isArray(collections)) {
    return next(new ErrorResponse('Please provide collections array', 400));
  }

  let savedPost = await SavedPost.findById(req.params.id);

  if (!savedPost) {
    return next(new ErrorResponse(`Saved post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns saved post
  if (savedPost.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this saved post', 401));
  }

  // Add new collections
  savedPost.collections = [...new Set([...savedPost.collections, ...collections])];
  await savedPost.save();

  res.status(200).json({
    success: true,
    data: savedPost
  });
});

// @desc    Remove post from collection
// @route   DELETE /api/v1/saved-posts/:id/collections/:name
// @access  Private
exports.removeFromCollection = asyncHandler(async (req, res, next) => {
  let savedPost = await SavedPost.findById(req.params.id);

  if (!savedPost) {
    return next(new ErrorResponse(`Saved post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns saved post
  if (savedPost.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this saved post', 401));
  }

  // Remove from collection
  savedPost.collections = savedPost.collections.filter(c => c !== req.params.name);
  await savedPost.save();

  res.status(200).json({
    success: true,
    data: savedPost
  });
});

// @desc    Get saved post stats
// @route   GET /api/v1/saved-posts/stats
// @access  Private
exports.getSavedPostStats = asyncHandler(async (req, res, next) => {
  const stats = await SavedPost.aggregate([
    { $match: { userId: req.user._id } },
    {
      $lookup: {
        from: 'posts',
        localField: 'postId',
        foreignField: '_id',
        as: 'post'
      }
    },
    { $unwind: '$post' },
    {
      $group: {
        _id: null,
        totalSaved: { $sum: 1 },
        avgPrice: { $avg: '$post.price.amount' },
        minPrice: { $min: '$post.price.amount' },
        maxPrice: { $max: '$post.price.amount' },
        propertyTypes: { $addToSet: '$post.propertyType' },
        areas: { $addToSet: '$post.location.address.area' }
      }
    },
    {
      $project: {
        _id: 0,
        totalSaved: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        minPrice: 1,
        maxPrice: 1,
        propertyTypes: 1,
        areas: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalSaved: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      propertyTypes: [],
      areas: []
    }
  });
});
