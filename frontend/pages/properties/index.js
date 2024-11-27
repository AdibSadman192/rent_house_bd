import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
  useMediaQuery,
  useTheme,
  Pagination,
  Card,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fade,
  Grow,
  Zoom,
  Paper,
  alpha
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
  AttachMoney as PriceIcon,
  Map as MapIcon,
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from '../../utils/axios';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import ErrorBoundary from '../../components/ErrorBoundary';
import { motion } from 'framer-motion';

import PropertyCard from '../../components/PropertyCard';
import SearchFilters from '../../components/SearchFilters';
import { useAuth } from '../../contexts/AuthContext';

const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);

// Dynamically import the map component
const MapView = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <MapLoadingFallback />
});

const ITEMS_PER_PAGE = 12;

// Map loading fallback component
const MapLoadingFallback = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

// Error fallback component
const ErrorFallback = ({ error, resetError }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Zoom in timeout={500}>
        <ErrorIcon color="error" sx={{ fontSize: 64 }} />
      </Zoom>
      <Typography 
        variant="h5" 
        color="error" 
        gutterBottom
        sx={{
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {error}
      </Typography>
      <Button
        startIcon={<RefreshIcon />}
        variant="contained"
        onClick={resetError}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          }
        }}
      >
        Try Again
      </Button>
    </Box>
  );
};

const Properties = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const observerRef = useRef();
  const animationFrameRef = useRef();

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const response = await axios.get('/properties/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch property types from API
  const fetchPropertyTypes = async () => {
    try {
      const response = await axios.get('/properties/types');
      setPropertyTypes(response.data);
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  };

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/users/favorites');
      setFavorites(response.data.map(fav => fav._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page,
          limit: ITEMS_PER_PAGE,
          sortBy,
          ...filters
        });

        const response = await axios.get(`/properties?${params}`);

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          setProperties(response.data.properties);
          setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
          setLoading(false);
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch properties');
        setLoading(false);
      }
    }, 300),
    [page, sortBy, filters]
  );

  // Fetch data when dependencies change
  useEffect(() => {
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [page, sortBy, filters]);

  // Fetch user-specific data
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
    fetchLocations();
    fetchPropertyTypes();
  }, [user]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!isMobile) return;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && page < totalPages) {
        setPage(prev => prev + 1);
      }
    }, options);

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, page, totalPages, isMobile]);

  // Handle errors
  const handleError = (error) => {
    console.error('Error:', error);
    setError(error.message || 'An unexpected error occurred');
  };

  // Reset error state
  const resetError = () => {
    setError(null);
    debouncedFetch();
  };

  // Handle sort menu
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setAnchorEl(null);
    setPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render loading skeletons
  const renderSkeletons = () => (
    <MotionGrid container spacing={3}>
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Skeleton 
            variant="rectangular" 
            height={300} 
            sx={{ 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }} 
          />
        </Grid>
      ))}
    </MotionGrid>
  );

  const renderPropertyGrid = () => {
    if (!properties || properties.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 8 
        }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No properties found
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Try adjusting your search filters or check back later
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => {
              setPage(1);
              setFilters({
                location: '',
                propertyType: '',
                priceRange: '',
                bedrooms: '',
                bathrooms: '',
              });
              debouncedFetch();
            }}
            variant="outlined"
            color="primary"
          >
            Reset Filters
          </Button>
        </Box>
      );
    }

    return (
      <MotionGrid 
        container 
        spacing={3}
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
        {properties.map((property, index) => (
          <Grid 
            item 
            xs={12} 
            sm={viewMode === 'list' ? 12 : 6} 
            md={viewMode === 'list' ? 12 : 4} 
            lg={viewMode === 'list' ? 12 : 3} 
            key={property._id}
          >
            <Grow in timeout={300 + index * 100}>
              <Card
                sx={{
                  height: '100%',
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
                <PropertyCard 
                  property={property}
                  viewMode={viewMode}
                  isFavorite={favorites.includes(property._id)}
                />
              </Card>
            </Grow>
          </Grid>
        ))}
      </MotionGrid>
    );
  };

  const renderMapView = () => {
    if (!properties || properties.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 8 
        }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No properties to display on map
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Try adjusting your search filters or check back later
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => {
              setPage(1);
              setFilters({
                location: '',
                propertyType: '',
                priceRange: '',
                bedrooms: '',
                bathrooms: '',
              });
              debouncedFetch();
            }}
            variant="outlined"
            color="primary"
          >
            Reset Filters
          </Button>
        </Box>
      );
    }

    return (
      <Paper
        elevation={0}
        sx={{
          height: 600,
          borderRadius: 2,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <MapView properties={properties} />
      </Paper>
    );
  };

  return (
    <MotionContainer
      maxWidth="xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        py: 4,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
      }}
    >
      <Box 
        mb={4}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 2,
          p: 3,
          boxShadow: theme.shadows[4]
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <SearchIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }} />
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
            Find Your Perfect Home
          </Typography>
        </Box>

        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          propertyTypes={propertyTypes}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Grid View">
            <IconButton 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              sx={{
                bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <GridViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="List View">
            <IconButton 
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              sx={{
                bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <ListViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Map View">
            <IconButton 
              onClick={() => setViewMode('map')}
              color={viewMode === 'map' ? 'primary' : 'default'}
              sx={{
                bgcolor: viewMode === 'map' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <MapIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Button
            startIcon={<SortIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            Sort By
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {properties.length} properties found
        </Typography>
      </Paper>

      {error ? (
        <ErrorFallback error={error} resetError={() => setError(null)} />
      ) : loading ? (
        renderSkeletons()
      ) : viewMode === 'map' ? (
        renderMapView()
      ) : (
        renderPropertyGrid()
      )}

      <Box 
        mt={4} 
        display="flex" 
        justifyContent="center"
        sx={{
          '& .MuiPagination-ul': {
            gap: 1
          }
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          size={isMobile ? 'small' : 'large'}
          sx={{
            '& .MuiPaginationItem-root': {
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                }
              }
            }
          }}
        />
      </Box>
    </MotionContainer>
  );
};

export default Properties;
