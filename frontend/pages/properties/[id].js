import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Grid, Button, Paper } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PropertyDetails from '@/components/properties/PropertyDetails';
import BookingForm from '@/components/properties/BookingForm';
import PropertyMap from '@/components/PropertyMap';
import axios from '@/lib/axios';

const PropertyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await axios.get(`/api/properties/${id}`);
      setProperty(data);
      setError(null);
    } catch (err) {
      setError('Failed to load property details');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box py={4} textAlign="center">
            <Typography>Loading property details...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Box py={4} textAlign="center">
            <Typography color="error">{error}</Typography>
            <Button onClick={() => router.back()} sx={{ mt: 2 }}>
              Go Back
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <Container>
          <Box py={4} textAlign="center">
            <Typography>Property not found</Typography>
            <Button onClick={() => router.push('/properties')} sx={{ mt: 2 }}>
              View All Properties
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box py={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <PropertyDetails property={property} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <BookingForm property={property} />
              </Paper>
              <Paper sx={{ p: 2 }}>
                <PropertyMap
                  location={{
                    lat: property.location.coordinates[1],
                    lng: property.location.coordinates[0]
                  }}
                  zoom={15}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default PropertyPage;
