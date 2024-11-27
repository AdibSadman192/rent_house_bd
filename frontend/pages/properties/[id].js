import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PropertyDetails from '@/components/properties/PropertyDetails';
import BookingForm from '@/components/properties/BookingForm';
import PropertyMap from '@/components/PropertyMap';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Fade, Grow, Zoom } from '@mui/material';

const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);

const PropertyPage = () => {
  const theme = useTheme();
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
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="80vh"
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <MotionContainer
          maxWidth="lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            py={8} 
            textAlign="center"
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              p: 4
            }}
          >
            <Typography 
              color="error" 
              variant="h5" 
              gutterBottom
              sx={{
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Typography>
            <Button 
              onClick={() => router.back()} 
              startIcon={<ArrowBack />}
              sx={{ 
                mt: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              Go Back
            </Button>
          </Box>
        </MotionContainer>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <MotionContainer
          maxWidth="lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            py={8} 
            textAlign="center"
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              p: 4
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Property not found
            </Typography>
            <Button 
              onClick={() => router.push('/properties')} 
              startIcon={<Home />}
              sx={{ 
                mt: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              View All Properties
            </Button>
          </Box>
        </MotionContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <MotionContainer
        maxWidth="lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
          minHeight: '100vh',
          py: 4
        }}
      >
        <Box 
          mb={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton 
            onClick={() => router.back()}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Property Details
          </Typography>
        </Box>

        <MotionGrid 
          container 
          spacing={4}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <Grid item xs={12} md={8}>
            <Grow in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <PropertyDetails property={property} />
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3 
              }}
            >
              <Grow in timeout={700}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <BookingForm property={property} />
                </Paper>
              </Grow>
              <Grow in timeout={900}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <PropertyMap
                    location={{
                      lat: property.location.coordinates[1],
                      lng: property.location.coordinates[0]
                    }}
                    zoom={15}
                  />
                </Paper>
              </Grow>
            </Box>
          </Grid>
        </MotionGrid>
      </MotionContainer>
    </Layout>
  );
};

export default PropertyPage;
