import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  useTheme,
  alpha,
  Skeleton,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';
import { format } from 'date-fns';
import Link from 'next/link';

const MotionContainer = motion(Container);
const MotionCard = motion(Card);

const BookingDetailsPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await axios.patch(`/api/bookings/${id}/cancel`);
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
      setCancelDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: theme.palette.warning.main,
      confirmed: theme.palette.success.main,
      cancelled: theme.palette.error.main,
      completed: theme.palette.info.main,
    };
    return statusColors[status?.toLowerCase()] || theme.palette.grey[500];
  };

  const getBookingStep = (status) => {
    const steps = ['Pending', 'Confirmed', 'Completed'];
    switch (status?.toLowerCase()) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'completed': return 2;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <MotionContainer 
      maxWidth="lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        py: 4,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
      }}
    >
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Booking Details
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette.error.main, 0.1),
          }}
        >
          {error}
        </Alert>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} key={index}>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : booking ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Stepper 
                      activeStep={getBookingStep(booking.status)}
                      sx={{
                        '& .MuiStepLabel-root': {
                          color: theme.palette.text.secondary,
                        },
                        '& .MuiStepLabel-active': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiStepLabel-completed': {
                          color: theme.palette.success.main,
                        },
                      }}
                    >
                      {['Pending', 'Confirmed', 'Completed'].map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5" gutterBottom>
                        {booking.property.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="body1" color="text.secondary">
                          {booking.property.address}
                        </Typography>
                      </Box>
                      <Chip
                        label={booking.status}
                        sx={{
                          backgroundColor: alpha(getStatusColor(booking.status), 0.1),
                          color: getStatusColor(booking.status),
                          fontWeight: 'medium',
                          mb: 2,
                        }}
                      />
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" color="text.secondary">
                              Start Date
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" color="text.secondary">
                              End Date
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Price Details
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Total Amount
                            </Typography>
                            <Typography variant="body1">
                              ${booking.totalAmount}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Deposit Amount
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                              ${booking.depositAmount}
                              {booking.depositPaid ? ' (Paid)' : ' (Pending)'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Move-in Details
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <HomeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="body1">
                          {booking.moveInDetails.preferredTime}
                        </Typography>
                      </Box>
                      {booking.moveInDetails.parkingRequired && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body1">
                            Parking Required
                          </Typography>
                        </Box>
                      )}
                      {booking.moveInDetails.specialRequests && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1">
                            Special Requests: {booking.moveInDetails.specialRequests}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {(user.role === 'owner' || user.role === 'admin') && booking.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleStatusChange('approved')}
                              sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                '&:hover': {
                                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleStatusChange('rejected')}
                              sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
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
                            sx={{
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.2),
                              },
                            }}
                          >
                            Delete Booking
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        ) : null}
      </AnimatePresence>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          },
        }}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancelling}
          >
            No, Keep Booking
          </Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            disabled={cancelling}
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
              },
            }}
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </MotionContainer>
  );
};

export default BookingDetailsPage;
