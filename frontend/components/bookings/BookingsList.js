import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  styled,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#FFA726';
      case 'confirmed':
        return '#66BB6A';
      case 'cancelled':
        return '#EF5350';
      default:
        return '#90A4AE';
    }
  };

  return {
    backgroundColor: alpha(getStatusColor(), 0.1),
    color: getStatusColor(),
    border: `1px solid ${alpha(getStatusColor(), 0.2)}`,
    fontWeight: 600,
    textTransform: 'capitalize',
  };
});

const BookingsList = ({ bookings, onViewDetails, onUpdateStatus, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleAction = (action) => {
    if (!selectedBooking) return;

    switch (action) {
      case 'view':
        onViewDetails(selectedBooking);
        break;
      case 'confirm':
        onUpdateStatus(selectedBooking.id, 'confirmed');
        break;
      case 'cancel':
        onUpdateStatus(selectedBooking.id, 'cancelled');
        break;
      case 'delete':
        onDelete(selectedBooking.id);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <Grid container spacing={3}>
      {bookings.map((booking, index) => (
        <Grid item xs={12} md={6} lg={4} key={booking.id}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    background: 'linear-gradient(45deg, var(--text-primary) 30%, var(--accent-color) 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                  }}
                >
                  Booking #{booking.id}
                </Typography>
                <Box>
                  <StatusChip
                    label={booking.status}
                    status={booking.status}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, booking)}
                    sx={{ ml: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ color: 'var(--accent-color)' }} />
                  <Typography variant="body2">{booking.userName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon sx={{ color: 'var(--accent-color)' }} />
                  <Typography variant="body2">{booking.propertyName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ color: 'var(--accent-color)' }} />
                  <Typography variant="body2">
                    {format(new Date(booking.checkIn), 'PP')} - {format(new Date(booking.checkOut), 'PP')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ color: 'var(--accent-color)' }} />
                  <Typography variant="body2">
                    ${booking.totalAmount}
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              color: 'var(--text-primary)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleAction('view')}>View Details</MenuItem>
        {selectedBooking?.status === 'pending' && (
          <MenuItem onClick={() => handleAction('confirm')}>Confirm Booking</MenuItem>
        )}
        {selectedBooking?.status !== 'cancelled' && (
          <MenuItem onClick={() => handleAction('cancel')}>Cancel Booking</MenuItem>
        )}
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'var(--error-color)' }}>
          Delete Booking
        </MenuItem>
      </Menu>
    </Grid>
  );
};

export default BookingsList;
