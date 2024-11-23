import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Divider,
  Paper,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  LocalParkingOutlined,
  EventAvailableOutlined,
  AccessTimeOutlined,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Flag as FlagIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Message as MessageIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import ImageCarousel from '../../components/ImageCarousel';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

// Fallback component while generating static page
function PropertyDetailFallback() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
}

const PropertyDetail = ({ property: initialProperty, error }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  
  const [bookingForm, setBookingForm] = useState({
    moveInDate: '',
    leaseDuration: '',
    message: ''
  });
  
  const [reportForm, setReportForm] = useState({
    reason: '',
    details: ''
  });
  
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });

  // New state for analytics and tabs
  const [analyticsData, setAnalyticsData] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
    
    // Increment view count
    incrementViewCount();
    
    // Load analytics if user is the renter
    if (user?.role === 'renter' && property.renter === user._id) {
      loadAnalytics();
      loadBookingRequests();
      loadInquiries();
    }
  }, [user]);

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/favorites/${property._id}`
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to save properties',
        severity: 'warning'
      });
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/favorites/${property._id}`,
        { action: isFavorite ? 'remove' : 'add' }
      );
      setIsFavorite(!isFavorite);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update favorites',
        severity: 'error'
      });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to report properties',
        severity: 'warning'
      });
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/report`, reportForm);
      setSnackbar({
        open: true,
        message: 'Report submitted successfully',
        severity: 'success'
      });
      setReportDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to submit report',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to review properties',
        severity: 'warning'
      });
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/reviews`, reviewForm);
      setSnackbar({
        open: true,
        message: 'Review submitted successfully',
        severity: 'success'
      });
      setReviewDialogOpen(false);
      router.reload(); // Reload to show new review
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to submit review',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleDeleteProperty = async () => {
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}`);
        router.push('/properties');
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to delete property',
          severity: 'error'
        });
      }
    }
  };

  const incrementViewCount = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/view`
      );
      setViewCount(response.data.views);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/analytics`
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoadingAnalytics(false);
  };

  const loadBookingRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/bookings`
      );
      setBookingRequests(response.data.bookings);
    } catch (error) {
      console.error('Error loading booking requests:', error);
    }
  };

  const loadInquiries = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property._id}/inquiries`
      );
      setInquiries(response.data.inquiries);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/${action}`
      );
      setSnackbar({
        open: true,
        message: `Booking ${action}ed successfully`,
        severity: 'success'
      });
      loadBookingRequests(); // Reload booking requests
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || `Failed to ${action} booking`,
        severity: 'error'
      });
    }
  };

  const handleInquiryReply = async (inquiryId, reply) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${inquiryId}/reply`,
        { reply }
      );
      setSnackbar({
        open: true,
        message: 'Reply sent successfully',
        severity: 'success'
      });
      loadInquiries(); // Reload inquiries
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send reply',
        severity: 'error'
      });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
        propertyId: property._id,
        ...contactForm
      });
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully!',
        severity: 'success'
      });
      setContactDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send message',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to book a property',
        severity: 'warning'
      });
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        propertyId: property._id,
        ...bookingForm
      });
      setSnackbar({
        open: true,
        message: 'Booking request sent successfully!',
        severity: 'success'
      });
      setBookingDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to submit booking request',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (router.isFallback) {
    return <PropertyDetailFallback />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Images Section */}
        <Grid item xs={12}>
          <ImageCarousel images={property.images} />
        </Grid>

        {/* Basic Info Section */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {property.title}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${property.price.toLocaleString()} / month
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={property.propertyType} color="primary" variant="outlined" />
              <Rating value={property.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({property.reviews.length} reviews)
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {property.description}
            </Typography>
          </Box>

          {/* Features */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <BedOutlined sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">{property.features.bedrooms}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <BathtubOutlined
                    sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">{property.features.bathrooms}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <SquareFootOutlined
                    sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">
                    {property.features.size.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sq Ft
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <LocalParkingOutlined
                    sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">
                    {property.features.parking ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Parking
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Amenities */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {property.amenities.map((amenity) => (
                <Chip key={amenity} label={amenity} />
              ))}
            </Box>
          </Box>

          {/* Location */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1">
              {property.address.street}
              <br />
              {property.address.city}, {property.address.state}{' '}
              {property.address.zipCode}
              <br />
              {property.address.country}
            </Typography>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventAvailableOutlined sx={{ mr: 1 }} />
              <Typography>
                Available from:{' '}
                {new Date(property.availableFrom).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeOutlined sx={{ mr: 1 }} />
              <Typography>
                Minimum lease: {property.minimumLeasePeriod} months
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            {/* Contact and Booking Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PhoneIcon />}
                onClick={() => setContactDialogOpen(true)}
              >
                Contact Owner
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => setBookingDialogOpen(true)}
              >
                Book Now
              </Button>
              {property.whatsapp && (
                <Button
                  variant="outlined"
                  fullWidth
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  href={`https://wa.me/${property.whatsapp}`}
                  target="_blank"
                >
                  WhatsApp
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Property ID
              </Typography>
              <Typography>{property._id}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Property Type
              </Typography>
              <Typography>{property.propertyType}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Furnished
              </Typography>
              <Typography>{property.features.furnished ? 'Yes' : 'No'}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Property Actions Menu */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={handleFavoriteToggle}>
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            setReportDialogOpen(true);
            setMenuAnchorEl(null);
          }}>
            <FlagIcon sx={{ mr: 1 }} /> Report Property
          </MenuItem>
          {user && ['admin', 'superadmin'].includes(user.role) && (
            <>
              <MenuItem onClick={() => {
                router.push(`/admin/properties/edit/${property._id}`);
                setMenuAnchorEl(null);
              }}>
                <EditIcon sx={{ mr: 1 }} /> Edit Property
              </MenuItem>
              <MenuItem onClick={() => {
                handleDeleteProperty();
                setMenuAnchorEl(null);
              }}>
                <DeleteIcon sx={{ mr: 1 }} /> Delete Property
              </MenuItem>
            </>
          )}
        </Menu>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Reviews</Typography>
          {user && (
            <Button
              variant="outlined"
              onClick={() => setReviewDialogOpen(true)}
            >
              Write a Review
            </Button>
          )}
        </Box>
        <List>
          {property.reviews?.map((review) => (
            <Card key={review._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar>{review.user.name[0]}</Avatar>
                  </ListItemAvatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {review.user.name}
                      </Typography>
                      {review.user.isVerified && (
                        <VerifiedIcon color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="caption" sx={{ ml: 'auto' }}>
                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      </Box>

      {/* Renter Analytics Section */}
      {user?.role === 'renter' && property.renter === user._id && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab label="Analytics" icon={<AnalyticsIcon />} />
              <Tab 
                label="Booking Requests" 
                icon={
                  <Badge badgeContent={bookingRequests.filter(b => b.status === 'pending').length} 
                    color="error">
                    <EventAvailableOutlined />
                  </Badge>
                } 
              />
              <Tab 
                label="Inquiries" 
                icon={
                  <Badge badgeContent={inquiries.filter(i => !i.replied).length} 
                    color="error">
                    <MessageIcon />
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {/* Analytics Tab */}
          {selectedTab === 0 && (
            <Box>
              {loadingAnalytics ? (
                <LinearProgress />
              ) : analyticsData ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4">{viewCount}</Typography>
                      <Typography color="text.secondary">Total Views</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4">{analyticsData.bookingRate}%</Typography>
                      <Typography color="text.secondary">Booking Rate</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <TimelineIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4">{analyticsData.averageRating.toFixed(1)}</Typography>
                      <Typography color="text.secondary">Average Rating</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <MessageIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4">{analyticsData.responseRate}%</Typography>
                      <Typography color="text.secondary">Response Rate</Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Monthly Stats Chart */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Monthly Statistics</Typography>
                      {/* Add chart component here */}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">No analytics data available</Alert>
              )}
            </Box>
          )}

          {/* Booking Requests Tab */}
          {selectedTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Move-in Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingRequests.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 1 }}>{booking.user.name[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2">{booking.user.name}</Typography>
                            <Typography variant="caption">{booking.user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.moveInDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{booking.leaseDuration} months</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === 'approved' ? 'success' :
                            booking.status === 'pending' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' && (
                          <Box>
                            <Tooltip title="Approve">
                              <IconButton
                                color="success"
                                onClick={() => handleBookingAction(booking._id, 'approve')}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                color="error"
                                onClick={() => handleBookingAction(booking._id, 'reject')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Inquiries Tab */}
          {selectedTab === 2 && (
            <List>
              {inquiries.map((inquiry) => (
                <Card key={inquiry._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>{inquiry.user.name[0]}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                          {inquiry.user.name}
                          {inquiry.user.isVerified && (
                            <VerifiedIcon
                              color="primary"
                              fontSize="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {inquiry.message}
                        </Typography>
                      </Box>
                    </Box>

                    {inquiry.reply ? (
                      <Box sx={{ ml: 7 }}>
                        <Typography variant="subtitle2" color="primary">
                          Your Reply:
                        </Typography>
                        <Typography variant="body2">{inquiry.reply}</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ ml: 7 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Write your reply..."
                          variant="outlined"
                          size="small"
                        />
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            const replyField = document.querySelector(`textarea[placeholder="Write your reply..."]`);
                            handleInquiryReply(inquiry._id, replyField.value);
                          }}
                        >
                          Send Reply
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
        <DialogTitle>Contact Property Owner</DialogTitle>
        <form onSubmit={handleContactSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Send Message'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)}>
        <DialogTitle>Book Property</DialogTitle>
        <form onSubmit={handleBookingSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Move-in Date"
                  value={bookingForm.moveInDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Lease Duration (months)"
                  value={bookingForm.leaseDuration}
                  onChange={(e) => setBookingForm({ ...bookingForm, leaseDuration: e.target.value })}
                  required
                  inputProps={{ min: property.minimumLeasePeriod }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Message"
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit Booking'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Report Property</DialogTitle>
        <form onSubmit={handleReportSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Reason"
                  value={reportForm.reason}
                  onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                  required
                >
                  <MenuItem value="incorrect_info">Incorrect Information</MenuItem>
                  <MenuItem value="spam">Spam</MenuItem>
                  <MenuItem value="scam">Potential Scam</MenuItem>
                  <MenuItem value="offensive">Offensive Content</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Details"
                  value={reportForm.details}
                  onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="error" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit Report'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}>
        <DialogTitle>Write a Review</DialogTitle>
        <form onSubmit={handleReviewSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    value={reviewForm.rating}
                    onChange={(e, newValue) => setReviewForm({ ...reviewForm, rating: newValue })}
                    size="large"
                    required
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Review"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit Review'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// This function gets called at request time on server-side.
export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${params.id}`
    );
    return {
      props: {
        property: response.data.data
      }
    };
  } catch (error) {
    return {
      props: {
        error: error.response?.data?.message || 'Failed to fetch property details'
      }
    };
  }
}

export default PropertyDetail;
