import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';

const BookingForm = ({ property }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/bookings', {
        propertyId: property._id,
        message
      });

      router.push('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Book this Property
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Message to Owner"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell the owner what you like about their property and when you'd like to view it."
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !message.trim()}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Request Booking'
        )}
      </Button>

      {!user && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Please log in to book this property
        </Typography>
      )}
    </Box>
  );
};

export default BookingForm;
