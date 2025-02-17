import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, Avatar, Button, TextField, Card, CardContent, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../utils/axios';

const PropertyReviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [propertyId, fetchReviews]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/properties/${propertyId}/reviews`);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/properties/${propertyId}/reviews`, {
        content: newReview,
        rating,
        userId: user.id,
        propertyId
      });
      setNewReview('');
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <Typography>Loading reviews...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Property Reviews
      </Typography>

      {user && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>
            <form onSubmit={handleSubmitReview}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={0.5}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience..."
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!rating || !newReview.trim()}
              >
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={12} key={review._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={review.user.avatar} alt={review.user.name} />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">{review.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly precision={0.5} sx={{ mb: 1 }} />
                <Typography variant="body1">{review.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {reviews.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No reviews yet. Be the first to review this property!
        </Typography>
      )}
    </Box>
  );
};

export default PropertyReviews;