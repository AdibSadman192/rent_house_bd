import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Autocomplete,
  Slide,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Bed as BedIcon,
  Bathroom as BathIcon,
  SquareFoot as SizeIcon,
  ArrowForward,
  MonetizationOn as PriceIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import propertyService from '../services/propertyService';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
  });

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredProps, locationData, propertyTypeData] = await Promise.all([
          propertyService.getFeaturedProperties(6),
          propertyService.getLocations(),
          propertyService.getPropertyTypes()
        ]);

        setFeaturedProperties(featuredProps);
        setLocations(locationData);
        setPropertyTypes(propertyTypeData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      router.push({
        pathname: '/search',
        query: searchParams
      });
    } catch (err) {
      console.error('Error searching properties:', err);
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6))',
              zIndex: 1,
            },
          }}
        >
          <Image
            src="/images/hero-bg.jpg"
            alt="Luxury apartment in Bangladesh"
            fill
            priority
            quality={100}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>

        {/* Hero Content */}
        <Container 
          maxWidth={false}
          sx={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Fade in timeout={1000}>
            <Stack 
              spacing={4} 
              alignItems="center"
              sx={{
                width: '100%',
                maxWidth: '1200px',
                px: { xs: 2, sm: 4, md: 6 },
              }}
            >
              <Typography
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  textAlign: 'center',
                  fontSize: {
                    xs: '2.5rem',
                    sm: '3.5rem',
                    md: '4.5rem',
                    lg: '5rem'
                  },
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Find Your Dream Home in Bangladesh
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  textAlign: 'center',
                  maxWidth: '800px',
                  fontWeight: 400,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Discover thousands of properties for rent across Bangladesh
              </Typography>

              {/* Search Box */}
              <Slide direction="up" in timeout={800}>
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 2, md: 3 },
                    width: '100%',
                    maxWidth: '900px',
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        fullWidth
                        options={locations}
                        value={searchParams.location}
                        onChange={(event, newValue) => 
                          setSearchParams(prev => ({ ...prev, location: newValue }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Location"
                            placeholder="Where do you want to live?"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        fullWidth
                        options={propertyTypes}
                        value={searchParams.propertyType}
                        onChange={(event, newValue) =>
                          setSearchParams(prev => ({ ...prev, propertyType: newValue }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Property Type"
                            placeholder="What type of property?"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Price Range"
                        value={searchParams.priceRange}
                        onChange={(e) =>
                          setSearchParams(prev => ({ ...prev, priceRange: e.target.value }))
                        }
                        SelectProps={{
                          native: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PriceIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <option value="">Any Price</option>
                        <option value="0-15000">৳0 - ৳15,000</option>
                        <option value="15000-30000">৳15,000 - ৳30,000</option>
                        <option value="30000-50000">৳30,000 - ৳50,000</option>
                        <option value="50000+">৳50,000+</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                          height: '56px',
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: theme.shadows[4],
                          '&:hover': {
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Slide>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* Featured Properties Section */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 6, md: 8 },
          px: { xs: 0, sm: 0 }, // Remove horizontal padding
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ mb: 8, px: 2 }}>
          <Typography 
            variant="h2" 
            component="h2"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Properties
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center"
            sx={{ 
              maxWidth: '600px',
              fontWeight: 400,
            }}
          >
            Explore our handpicked selection of premium properties
          </Typography>
        </Stack>

        <Grid container spacing={0}>
          {featuredProperties.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    '& .property-image': {
                      transform: 'scale(1.05)',
                    },
                    '& .property-content': {
                      transform: 'translateY(-4px)',
                    }
                  },
                }}
              >
                {/* Property Image Container */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: '100%',
                    pt: '80%',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    className="property-image"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                      style={{ 
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </Box>
                  {property.featured && (
                    <Chip
                      label="Featured"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: 600,
                        backgroundColor: 'rgba(25, 118, 210, 0.9)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        zIndex: 2,
                        '& .MuiChip-label': {
                          px: 2,
                          py: 0.5,
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Property Content */}
                <Box 
                  className="property-content"
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
                    color: 'white',
                    p: 3,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {property.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {property.location}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      ৳{property.price.toLocaleString()}/month
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={4}>
                        <Stack alignItems="center" spacing={0.5}>
                          <BedIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {property.beds} Beds
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack alignItems="center" spacing={0.5}>
                          <BathIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {property.baths} Baths
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack alignItems="center" spacing={0.5}>
                          <SizeIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {property.size} sqft
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      href={`/properties/${property.id}`}
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 2,
                        py: 1,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: 'text.primary',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                          backgroundColor: 'white',
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default withAuth(Home, { requireAuth: false });
