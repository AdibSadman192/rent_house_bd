import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Villa as VillaIcon,
  Pool as PoolIcon,
  LocalParking as ParkingIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProperties = [
    {
      id: 1,
      title: 'Luxury Beachfront Villa',
      location: 'Miami Beach, FL',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      type: 'Villa',
      amenities: ['Pool', 'Beach Access', 'Security'],
    },
    {
      id: 2,
      title: 'Modern Downtown Apartment',
      location: 'New York, NY',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      type: 'Apartment',
      amenities: ['Gym', 'Parking', 'Doorman'],
    },
    {
      id: 3,
      title: 'Cozy Suburban Home',
      location: 'Austin, TX',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
      type: 'House',
      amenities: ['Garden', 'Garage', 'Patio'],
    },
  ];

  const amenityIcons = {
    Pool: <PoolIcon />,
    Parking: <ParkingIcon />,
    Security: <SecurityIcon />,
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
          backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant={isMobile ? 'h3' : 'h1'}
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 4,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Find Your Dream Home
          </Typography>
          <Paper
            sx={{
              p: 2,
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search by location, property type, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<SearchIcon />}
                  component={Link}
                  href="/search"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Featured Properties */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Properties
        </Typography>
        <Grid container spacing={4}>
          {featuredProperties.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={property.image}
                  alt={property.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {property.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${property.price}/month
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {property.amenities.map((amenity) => (
                      <Chip
                        key={amenity}
                        icon={amenityIcons[amenity]}
                        label={amenity}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    component={Link}
                    href={`/properties/${property.id}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Wide Selection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse through thousands of properties
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Trusted Platform
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified properties and renters
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <ApartmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  All Property Types
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From apartments to luxury villas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <VillaIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Premium Locations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Properties in prime areas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Find Your Perfect Home?
            </Typography>
            <Typography variant="body1" paragraph>
              Join thousands of satisfied renters who found their dream home with us.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              component={Link}
              href="/signup"
            >
              Get Started
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

// Specify that this page doesn't require authentication
Home.auth = false;
