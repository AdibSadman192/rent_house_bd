import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Pagination
} from '@mui/material';
import {
  Message as MessageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const BookingList = ({ userRole, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    bookingId: null,
    messages: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    bookingId: null,
    currentStatus: ''
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings?page=${page}`);
      setBookings(response.data.data);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
      setStatusDialog({ open: false, bookingId: null, currentStatus: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`/api/bookings/${bookingId}`);
        fetchBookings();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete booking');
      }
    }
  };

  const handleOpenMessages = async (bookingId) => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}/messages`);
      setMessageDialog({
        open: true,
        bookingId,
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
      await axios.post(`/api/bookings/${messageDialog.bookingId}/messages`, {
        message: newMessage
      });
      
      const response = await axios.get(`/api/bookings/${messageDialog.bookingId}/messages`);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking._id}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {booking.property.title}
                    </Typography>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status)}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        <strong>Dates:</strong>{' '}
                        {format(new Date(booking.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography>
                        <strong>Total Amount:</strong> ${booking.totalAmount}
                      </Typography>
                      <Typography>
                        <strong>Deposit:</strong> ${booking.depositAmount}
                        {booking.depositPaid ? ' (Paid)' : ' (Pending)'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        <strong>Move-in Time:</strong> {booking.moveInDetails.preferredTime}
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

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenMessages(booking._id)}
                    >
                      <MessageIcon />
                    </IconButton>

                    {(userRole === 'owner' || userRole === 'admin') && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                          disabled={booking.status !== 'pending'}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                          disabled={booking.status !== 'pending'}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}

                    {(booking.tenant === userId || userRole === 'admin') && (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Messages Dialog */}
      <Dialog
        open={messageDialog.open}
        onClose={() => setMessageDialog({ open: false, bookingId: null, messages: [] })}
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
                  backgroundColor: msg.sender._id === userId ? '#e3f2fd' : '#f5f5f5',
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
          <Button onClick={() => setMessageDialog({ open: false, bookingId: null, messages: [] })}>
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
    </Box>
  );
};

export default BookingList;
