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
  Fade
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
import { motion, AnimatePresence } from 'framer-motion';
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
      height: 400, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'background.paper',
      borderRadius: 1
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
      textAlign: 'center'
    }}
  >
    <ErrorIcon color="error" sx={{ fontSize: 48 }} />
    <Typography variant="h6" color="error">
      {error.message || 'Something went wrong'}
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
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isHighRefreshRate = useMediaQuery('(min-resolution: 120dpi)');

  // Refs for infinite scroll and animation frame
  const observerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // State management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  
  // Sort menu state
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    propertyType: '',
    priceRange: [0, 100000],
    bedrooms: '',
    bathrooms: '',
    amenities: []
  });

  // Optimized fetch function with debounce
  const debouncedFetch = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/properties', {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
            sortBy,
            ...filters,
            priceRange: filters.priceRange.join('-')
          }
        });

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

  // Render property grid with animations
  const renderPropertyGrid = () => (
    <AnimatePresence mode="wait">
      <Grid container spacing={3}>
        {properties.map((property, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: isHighRefreshRate ? 0.2 : 0.3,
                delay: index * (isHighRefreshRate ? 0.05 : 0.1)
              }}
            >
              <PropertyCard
                property={property}
                isFavorite={favorites.includes(property._id)}
                onFavoriteToggle={handleFavoriteToggle}
                isHighRefreshRate={isHighRefreshRate}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimatePresence>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            locations={locations}
            propertyTypes={propertyTypes}
          />
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Properties
            {!loading && ` (${properties.length})`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Toggle Map View">
              <IconButton onClick={() => setShowMap(!showMap)} color={showMap ? 'primary' : 'default'}>
                <MapIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Change View">
              <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort Properties">
              <IconButton onClick={(e) => setSortAnchorEl(e.currentTarget)}>
                <SortIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={resetError}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Fade in={showMap}>
          <Box sx={{ mb: 3, display: showMap ? 'block' : 'none' }}>
            <MapView properties={properties} />
          </Box>
        </Fade>

        {loading ? renderSkeletons() : renderPropertyGrid()}

        {!isMobile && !loading && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        )}

        {isMobile && <div id="scroll-sentinel" style={{ height: '20px' }} />}

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem 
            onClick={() => {
              setSortBy('newest');
              setSortAnchorEl(null);
            }}
            selected={sortBy === 'newest'}
          >
            <ListItemIcon>
              <TimeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Newest First</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('price_asc');
              setSortAnchorEl(null);
            }}
            selected={sortBy === 'price_asc'}
          >
            <ListItemIcon>
              <PriceIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Price: Low to High</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('price_desc');
              setSortAnchorEl(null);
            }}
            selected={sortBy === 'price_desc'}
          >
            <ListItemIcon>
              <PriceIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Price: High to Low</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('popular');
              setSortAnchorEl(null);
            }}
            selected={sortBy === 'popular'}
          >
            <ListItemIcon>
              <TrendingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Most Popular</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </ErrorBoundary>
  );
};

export default Properties;
