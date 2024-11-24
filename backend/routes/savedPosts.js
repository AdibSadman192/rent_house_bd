const express = require('express');
const {
  savePost,
  getSavedPosts,
  getSavedPost,
  updateSavedPost,
  deleteSavedPost,
  getCollections,
  getPostsByCollection,
  addToCollection,
  removeFromCollection,
  getSavedPostStats
} = require('../controllers/savedPostController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Stats route
router.get('/stats', protect, getSavedPostStats);

// Collection routes
router.get('/collections', protect, getCollections);
router.get('/collections/:name', protect, getPostsByCollection);
router.put('/:id/collections', protect, addToCollection);
router.delete('/:id/collections/:name', protect, removeFromCollection);

// Standard routes
router
  .route('/')
  .get(protect, getSavedPosts)
  .post(protect, savePost);

router
  .route('/:id')
  .get(protect, getSavedPost)
  .put(protect, updateSavedPost)
  .delete(protect, deleteSavedPost);

module.exports = router;
