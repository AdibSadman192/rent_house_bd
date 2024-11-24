import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import { formatDistanceToNow } from 'date-fns';

const ReviewSystem = ({ propertyId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/properties/${propertyId}/reviews`);
      setReviews(data.reviews);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (_, value) => {
    setFormData({
      ...formData,
      rating: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedReview) {
        await axios.put(`/api/reviews/${selectedReview._id}`, formData);
        toast.success('Review updated successfully');
      } else {
        await axios.post(`/api/properties/${propertyId}/reviews`, formData);
        toast.success('Review submitted successfully');
      }
      setDialogOpen(false);
      setSelectedReview(null);
      setFormData({ rating: 0, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment
    });
    setDialogOpen(true);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleReport = async (reviewId) => {
    try {
      await axios.post(`/api/reviews/${reviewId}/report`);
      toast.success('Review reported successfully');
    } catch (error) {
      toast.error('Failed to report review');
    }
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading && !reviews.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Reviews Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              Reviews & Ratings
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Rating
                value={calculateAverageRating()}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                ({reviews.length} reviews)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedReview(null);
              setFormData({ rating: 0, comment: '' });
              setDialogOpen(true);
            }}
          >
            Write a Review
          </Button>
        </Box>

        {/* Rating Distribution */}
        <Box mt={3}>
          {Object.entries(getRatingDistribution())
            .reverse()
            .map(([rating, count]) => (
              <Box
                key={rating}
                display="flex"
                alignItems="center"
                gap={2}
                mb={1}
              >
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  {rating}★
                </Typography>
                <Box
                  flex={1}
                  bgcolor="grey.200"
                  height={8}
                  borderRadius={4}
                  overflow="hidden"
                >
                  <Box
                    bgcolor="primary.main"
                    height="100%"
                    width={`${(count / reviews.length) * 100}%`}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {count}
                </Typography>
              </Box>
            ))}
        </Box>
      </Paper>

      {/* Reviews List */}
      <List>
        {reviews.map((review) => (
          <ListItem
            key={review._id}
            alignItems="flex-start"
            sx={{
              bgcolor: 'background.paper',
              mb: 2,
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <ListItemAvatar>
              <Avatar src={review.user.avatar}>
                {review.user.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle1">
                      {review.user.name}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Box>
                    {user?._id === review.user._id ? (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(review)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(review._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => handleReport(review._id)}
                      >
                        <ReportIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', my: 1 }}
                  >
                    {review.comment}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true
                    })}
                  </Typography>
                  {review.isVerifiedStay && (
                    <Chip
                      size="small"
                      label="Verified Stay"
                      color="success"
                      sx={{ ml: 1 }}
                    />
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Review Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedReview ? 'Edit Review' : 'Write a Review'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Typography component="legend">Your Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
              />
            </Box>
            <TextField
              name="comment"
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              value={formData.comment}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting || !formData.rating}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              selectedReview ? 'Update' : 'Submit'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewSystem;
