import { useState, useEffect } from 'react';
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
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  ElectricBolt as GeneratorIcon,
  Elevator as LiftIcon,
  Security as SecurityIcon,
  LocalParking as ParkingIcon,
  LocalFireDepartment as GasIcon,
  Videocam as CctvIcon,
  Water as WaterIcon,
  Wifi as InternetIcon,
  Bed as BedIcon,
  Bathroom as BathIcon,
  SquareFoot as SizeIcon,
  ArrowForward,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import propertyService from '../services/propertyService';
import { useRouter } from 'next/router';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        const [
          featuredProps,
          locationData,
          propertyTypeData
        ] = await Promise.all([
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

  const amenityIcons = {
    Generator: <GeneratorIcon />,
    Lift: <LiftIcon />,
    Security: <SecurityIcon />,
    Parking: <ParkingIcon />,
    'Gas Connection': <GasIcon />,
    CCTV: <CctvIcon />,
    'Water Reserve': <WaterIcon />,
    Internet: <InternetIcon />,
  };

  const handleSearch = async () => {
    try {
      const results = await propertyService.searchProperties(searchParams);
      // Handle search results (e.g., redirect to search results page)
      router.push({
        pathname: '/search',
        query: searchParams
      });
    } catch (err) {
      console.error('Error searching properties:', err);
    }
  };

  return (
    <Box>
      <Navbar />
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
          backgroundImage: 'url(/images/hero-bg.jpg)', // Replace with a relevant Bangladesh property image
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
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Find Your Perfect Home in Bangladesh
          </Typography>
          <Paper
            sx={{
              p: 3,
              maxWidth: 800,
              mx: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
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
                      placeholder="Location"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
                      placeholder="Property Type"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleSearch}
                  sx={{ height: '56px' }}
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
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 1 }}>
          Featured Properties
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Discover the finest properties across Bangladesh
        </Typography>
        <Grid container spacing={3}>
          {featuredProperties.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                  position: 'relative',
                }}
              >
                {property.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}
                  />
                )}
                {!property.available && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h6">Rented Out</Typography>
                  </Box>
                )}
                <Box sx={{ position: 'relative', paddingTop: '66.67%' }}>
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 48,
                      }}
                    >
                      {property.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {property.location}
                      </Typography>
                    </Stack>
                  </Box>
                  
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    ৳{property.price.toLocaleString()}/month
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.beds}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BathIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.baths}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SizeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.size} sqft</Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 40,
                    }}
                  >
                    {property.description}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mb: 2 }}
                  >
                    {property.amenities.map((amenity) => (
                      <Chip
                        key={amenity.name}
                        icon={amenityIcons[amenity.name]}
                        label={amenity.name}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    component={Link}
                    href={`/properties/${property.id}`}
                    endIcon={<ArrowForward />}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Specify that this page doesn't require authentication
Home.auth = false;
