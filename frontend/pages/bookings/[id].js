import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const BookingDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    messages: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${id}`);
      setBooking(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status: newStatus });
      fetchBooking();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        router.push('/bookings');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete booking');
      }
    }
  };

  const handleOpenMessages = async () => {
    try {
      const response = await axios.get(`/api/bookings/${id}/messages`);
      setMessageDialog({
        open: true,
        messages: response.data.data
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      await axios.post(`/api/bookings/${id}/messages`, {
        message: newMessage
      });
      
      const response = await axios.get(`/api/bookings/${id}/messages`);
      setMessageDialog(prev => ({
        ...prev,
        messages: response.data.data
      }));
      
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      cancelled: 'error',
      completed: 'info'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Booking not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                Booking Details
              </Typography>
              <Chip
                label={booking.status.toUpperCase()}
                color={getStatusColor(booking.status)}
                size="large"
              />
            </Box>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Property Information
                </Typography>
                <Typography>
                  <strong>Title:</strong> {booking.property.title}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {booking.property.address}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Booking Period
                </Typography>
                <Typography>
                  <strong>Start Date:</strong>{' '}
                  {format(new Date(booking.startDate), 'MMMM dd, yyyy')}
                </Typography>
                <Typography>
                  <strong>End Date:</strong>{' '}
                  {format(new Date(booking.endDate), 'MMMM dd, yyyy')}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Financial Details
                </Typography>
                <Typography>
                  <strong>Total Amount:</strong> ${booking.totalAmount}
                </Typography>
                <Typography>
                  <strong>Deposit Amount:</strong> ${booking.depositAmount}
                  {booking.depositPaid ? ' (Paid)' : ' (Pending)'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Move-in Details
                </Typography>
                <Typography>
                  <strong>Preferred Time:</strong> {booking.moveInDetails.preferredTime}
                </Typography>
                {booking.moveInDetails.parkingRequired && (
                  <Typography>
                    <strong>Parking Required</strong>
                  </Typography>
                )}
                {booking.moveInDetails.specialRequests && (
                  <Typography>
                    <strong>Special Requests:</strong>{' '}
                    {booking.moveInDetails.specialRequests}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Divider />

            <Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleOpenMessages}
                >
                  View Messages
                </Button>

                {(user.role === 'owner' || user.role === 'admin') && booking.status === 'pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange('approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusChange('rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {(booking.tenant === user.id || user.role === 'admin') && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteBooking}
                  >
                    Delete Booking
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Messages Dialog */}
      <Dialog
        open={messageDialog.open}
        onClose={() => setMessageDialog({ open: false, messages: [] })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Messages</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {messageDialog.messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: msg.sender._id === user.id ? '#e3f2fd' : '#f5f5f5',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2">
                  {msg.sender.name} - {format(new Date(msg.timestamp), 'MMM dd, yyyy HH:mm')}
                </Typography>
                <Typography>{msg.message}</Typography>
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sendingMessage}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog({ open: false, messages: [] })}>
            Close
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendingMessage}
            variant="contained"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingDetailsPage;
