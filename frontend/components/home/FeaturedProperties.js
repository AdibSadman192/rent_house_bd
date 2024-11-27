import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Stack,
  styled,
} from '@mui/material';
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  SingleBed,
  Bathtub,
  Square,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const PropertyImage = styled(CardMedia)(({ theme }) => ({
  height: 240,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
    zIndex: 1,
  },
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  borderRadius: '12px',
  padding: '0 12px',
  '& .MuiChip-label': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const PropertyFeature = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& svg': {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
  },
}));

const FeaturedProperties = ({ properties = [] }) => {
  // Sample data - replace with actual data from your API
  const sampleProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan, Dhaka',
      price: '৳45,000',
      image: '/images/properties/apartment-1.jpg',
      rating: 4.8,
      beds: 3,
      baths: 2,
      area: '1,200',
      favorite: false,
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      location: 'Banani, Dhaka',
      price: '৳85,000',
      image: '/images/properties/villa-1.jpg',
      rating: 4.9,
      beds: 4,
      baths: 3,
      area: '2,500',
      favorite: true,
    },
    {
      id: 3,
      title: 'Cozy Studio in Dhanmondi',
      location: 'Dhanmondi, Dhaka',
      price: '৳25,000',
      image: '/images/properties/studio-1.jpg',
      rating: 4.6,
      beds: 1,
      baths: 1,
      area: '650',
      favorite: false,
    },
  ];

  const displayProperties = properties.length > 0 ? properties : sampleProperties;

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, rgba(0,106,78,0.05) 0%, rgba(0,106,78,0.1) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #006A4E 0%, #2E8B57 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Featured Properties
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
            >
              Discover our hand-picked selection of premium rental properties
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {displayProperties.map((property, index) => (
            <Grid item xs={12} md={4} key={property.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard>
                  <Box sx={{ position: 'relative' }}>
                    <PropertyImage
                      image={property.image}
                      title={property.title}
                    />
                    <PriceChip label={property.price} />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        color: property.favorite ? '#F42A41' : 'white',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      {property.favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {property.title}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ color: 'text.secondary' }}
                        >
                          <LocationOn sx={{ fontSize: '1rem', color: 'primary.main' }} />
                          <Typography variant="body2">{property.location}</Typography>
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={2}>
                        <PropertyFeature>
                          <SingleBed />
                          <Typography variant="body2">{property.beds} Beds</Typography>
                        </PropertyFeature>
                        <PropertyFeature>
                          <Bathtub />
                          <Typography variant="body2">{property.baths} Baths</Typography>
                        </PropertyFeature>
                        <PropertyFeature>
                          <Square />
                          <Typography variant="body2">{property.area} sqft</Typography>
                        </PropertyFeature>
                      </Stack>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating
                            value={property.rating}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                          <Typography variant="body2" color="text.secondary">
                            ({property.rating})
                          </Typography>
                        </Stack>
                        <Link href={`/properties/${property.id}`} passHref>
                          <IconButton
                            color="primary"
                            sx={{
                              background: 'rgba(0,106,78,0.1)',
                              '&:hover': {
                                background: 'rgba(0,106,78,0.2)',
                              },
                            }}
                          >
                            <ArrowForward />
                          </IconButton>
                        </Link>
                      </Stack>
                    </Stack>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/properties" passHref>
              <Typography
                component="a"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                View All Properties
                <ArrowForward sx={{ fontSize: '1.2rem' }} />
              </Typography>
            </Link>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedProperties;
