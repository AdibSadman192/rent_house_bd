import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiUser, 
  FiFilter 
} from 'react-icons/fi';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Samira Ahmed',
      avatar: '/images/avatars/user1.jpg',
      rating: 5,
      date: '2024-02-15',
      property: 'Gulshan Apartment',
      comment: 'Excellent property with great amenities and very responsive management.',
      likes: 12,
      dislikes: 2
    },
    {
      id: 2,
      user: 'Rashid Khan',
      avatar: '/images/avatars/user2.jpg',
      rating: 4,
      date: '2024-02-10',
      property: 'Banani Residence',
      comment: 'Good location and comfortable living space. Minor maintenance issues.',
      likes: 8,
      dislikes: 5
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar 
        key={index} 
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-500' : 'text-gray-300'
        }`} 
      />
    ));
  };

  const submitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    const review = {
      id: reviews.length + 1,
      user: 'Current User',
      avatar: '/images/avatars/default.jpg',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      property: 'Selected Property',
      comment: newReview.comment,
      likes: 0,
      dislikes: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Review Submission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Write a Review
          </h2>
          
          {/* Star Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-gray-600">Your Rating:</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <FiStar 
                    className={`w-6 h-6 transition-colors ${
                      star <= newReview.rating 
                        ? 'text-yellow-500' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Input */}
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Share your experience..."
            className="w-full p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 mb-4"
            rows={4}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={submitReview}
            className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Submit Review
          </motion.button>
        </motion.div>

        {/* Reviews Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Property Reviews
          </h2>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl p-2"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map(review => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={review.avatar} 
                    alt={review.user} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.user}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Reviewed {review.property}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                    <FiThumbsUp />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                    <FiThumbsDown />
                    <span>{review.dislikes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
