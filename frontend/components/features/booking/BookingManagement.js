import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import { formatDate, formatPrice } from '../../../utils/format';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: ''
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings');
      setBookings(data.bookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewMode(true);
    setDialogOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      status: booking.status,
      notes: booking.notes || ''
    });
    setViewMode(false);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`/api/bookings/${selectedBooking._id}`, formData);
      toast.success('Booking updated successfully');
      setDialogOpen(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && !bookings.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Booking Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.property.title}</TableCell>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{formatDate(booking.checkIn)}</TableCell>
                <TableCell>{formatDate(booking.checkOut)}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatPrice(booking.totalAmount)}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleView(booking)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEdit(booking)}>
                    <EditIcon />
                  </IconButton>
                  {booking.status === 'pending' && (
                    <>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {viewMode ? 'Booking Details' : (selectedBooking ? 'Edit Booking' : 'Create Booking')}
        </DialogTitle>
        <DialogContent>
          {viewMode ? (
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Property</Typography>
                  <Typography>{selectedBooking?.property.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Guest</Typography>
                  <Typography>{selectedBooking?.user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Contact</Typography>
                  <Typography>{selectedBooking?.user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Check In</Typography>
                  <Typography>{formatDate(selectedBooking?.checkIn)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Check Out</Typography>
                  <Typography>{formatDate(selectedBooking?.checkOut)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={selectedBooking?.status}
                    color={getStatusColor(selectedBooking?.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Total Amount</Typography>
                  <Typography>{formatPrice(selectedBooking?.totalAmount)}</Typography>
                </Grid>
                {selectedBooking?.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Notes</Typography>
                    <Typography>{selectedBooking.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="checkIn"
                    label="Check In"
                    type="date"
                    fullWidth
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="checkOut"
                    label="Check Out"
                    type="date"
                    fullWidth
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notes"
                    label="Notes"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          {!viewMode && (
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingManagement;
