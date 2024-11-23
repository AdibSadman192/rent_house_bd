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
  Zoom
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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from '../../utils/axios';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import ErrorBoundary from '../../components/ErrorBoundary';

import PropertyCard from '../../components/PropertyCard';
import SearchFilters from '../../components/SearchFilters';
import { useAuth } from '../../contexts/AuthContext';

// Dynamically import the map component
const MapView = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <MapLoadingFallback />
});

const ITEMS_PER_PAGE = 12;

// Map loading fallback component
const MapLoadingFallback = () => (
  <Box
    sx={{
      height: '100%',
      minHeight: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.100',
      borderRadius: 1,
    }}
  >
    <CircularProgress />
  </Box>
);

// Error fallback component
const ErrorFallback = ({ error, resetError }) => (
  <Box
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <ErrorIcon color="error" sx={{ fontSize: 48 }} />
    <Typography variant="h6" color="error" gutterBottom>
      {error}
    </Typography>
    <Button
      startIcon={<RefreshIcon />}
      variant="contained"
      onClick={resetError}
    >
      Try Again
    </Button>
  </Box>
);

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
    <Grid container spacing={3}>
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
          <Skeleton
            variant="rectangular"
            height={isMobile ? 200 : 300}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
      ))}
    </Grid>
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
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property._id} xs={12} sm={6} md={4}>
            <Grow in={true} timeout={300}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <PropertyCard
                  property={property}
                  isFavorite={favorites.includes(property._id)}
                  onToggleFavorite={() => handleToggleFavorite(property._id)}
                />
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
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
      <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', minHeight: 400 }}>
        <MapView properties={properties} />
      </Box>
    );
  };

  if (error) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          locations={locations}
          propertyTypes={propertyTypes}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Button
              startIcon={viewMode === 'grid' ? <MapIcon /> : <GridViewIcon />}
              onClick={toggleViewMode}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              {viewMode === 'grid' ? 'Map View' : 'Grid View'}
            </Button>
          </Box>

          <Button
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            variant="outlined"
          >
            Sort By
          </Button>
        </Box>

        {error ? (
          <Alert 
            severity="error" 
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  debouncedFetch();
                }}
              >
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        ) : null}

        {loading ? renderSkeletons() : (
          viewMode === 'grid' ? renderPropertyGrid() : renderMapView()
        )}

        {!isMobile && viewMode === 'grid' && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        )}

        {isMobile && viewMode === 'grid' && (
          <Box
            id="scroll-sentinel"
            sx={{
              width: '100%',
              height: '20px',
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {loading && <CircularProgress size={24} />}
          </Box>
        )}
      </Container>
    </Fade>
  );
};

export default Properties;
