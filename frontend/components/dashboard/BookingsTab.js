import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const BookingRow = ({ booking, onApprove, onReject, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableRow>
      <TableCell>{booking.property.title}</TableCell>
      <TableCell>{booking.user.name}</TableCell>
      <TableCell>{format(new Date(booking.checkIn), 'PP')}</TableCell>
      <TableCell>{format(new Date(booking.checkOut), 'PP')}</TableCell>
      <TableCell>
        <Chip
          label={booking.status}
          color={getStatusColor(booking.status)}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {booking.status === 'pending' && (
            <>
              <MenuItem
                onClick={() => {
                  onApprove(booking);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Approve</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onReject(booking);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <CloseIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reject</ListItemText>
              </MenuItem>
            </>
          )}
          <MenuItem
            onClick={() => {
              onDelete(booking);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/bookings', {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      setBookings(response.data.data);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleApprove = async (booking) => {
    try {
      await axiosInstance.patch(`/api/bookings/${booking.id}/approve`);
      toast.success('Booking approved successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to approve booking');
      console.error('Error approving booking:', err);
    }
  };

  const handleReject = async (booking) => {
    try {
      await axiosInstance.patch(`/api/bookings/${booking.id}/reject`);
      toast.success('Booking rejected successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to reject booking');
      console.error('Error rejecting booking:', err);
    }
  };

  const handleDelete = async (booking) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/bookings/${booking.id}`);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to delete booking');
      console.error('Error deleting booking:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (bookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No bookings found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default BookingsTab;
