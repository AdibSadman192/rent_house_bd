import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../src/contexts/AuthContext';
import Layout from '../../src/components/Layout';
import Image from 'next/image';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
  Rating,
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  LocationOn,
  Phone,
  Email,
  WhatsApp as WhatsAppIcon,
  Favorite,
  FavoriteBorder,
  Share,
  Report,
} from '@mui/icons-material';

// Loading fallback component
const PropertyDetailFallback = () => (
  <Layout>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ width: '100%', mt: 4 }}>
        <CircularProgress />
      </Box>
    </Container>
  </Layout>
);

const PropertyDetail = ({ property: initialProperty, error: initialError }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // If the page is not yet generated, this will be displayed
  // initially until getServerSideProps() completes
  if (router.isFallback) {
    return <PropertyDetailFallback />;
  }

  // If there was an error fetching the property
  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  // If no property data
  if (!property) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            Property not found
          </Alert>
        </Container>
      </Layout>
    );
  }

  const handleContact = async () => {
    if (!user) {
      router.push('/login?redirect=' + router.asPath);
      return;
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
        property: property._id,
        message: 'Interested in this property'
      });
      
      setSnackbar({
        open: true,
        message: 'Message sent successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to send message',
        severity: 'error'
      });
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login?redirect=' + router.asPath);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/favorites/${property._id}`
      );
      setIsFavorite(response.data.isFavorite);
      setSnackbar({
        open: true,
        message: response.data.isFavorite 
          ? 'Added to favorites' 
          : 'Removed from favorites',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to update favorites',
        severity: 'error'
      });
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Property Images */}
        <Box sx={{ mb: 4, position: 'relative', height: 400 }}>
          <Image
            src={property.images?.[0] || '/placeholder.jpg'}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </Box>

        <Grid container spacing={4}>
          {/* Property Details */}
          <Grid item xs={12} md={8}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {property.title}
                </Typography>
                <Box>
                  <IconButton onClick={toggleFavorite} color="primary">
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  {property.location}
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" gutterBottom>
                ৳{property.price?.toLocaleString() || 'Price not available'} / month
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={property.propertyType} color="primary" variant="outlined" />
                <Chip label={property.status} color="secondary" variant="outlined" />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BedOutlined sx={{ mr: 1 }} />
                  <Typography>{property.bedrooms} Beds</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BathtubOutlined sx={{ mr: 1 }} />
                  <Typography>{property.bathrooms} Baths</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SquareFootOutlined sx={{ mr: 1 }} />
                  <Typography>{property.size} sqft</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography paragraph>
                {property.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {property.amenities?.map((amenity) => (
                  <Chip key={amenity} label={amenity} variant="outlined" />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Owner
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Phone />}
                  onClick={handleContact}
                  sx={{ mb: 2 }}
                >
                  Call Owner
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                  onClick={handleContact}
                  sx={{ mb: 2 }}
                >
                  Email Owner
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  onClick={handleContact}
                >
                  WhatsApp
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" align="center">
                Response time: Usually within 24 hours
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
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
        property: response.data.data || null,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return {
      props: {
        property: null,
        error: error.response?.data?.message || 'Failed to fetch property details'
      }
    };
  }
}

export default PropertyDetail;
