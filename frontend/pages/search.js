import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  AttachMoney,
  Hotel,
  FilterList,
  Sort,
  LocationOn as LocationIcon,
  Hotel as BedIcon,
  Bathroom as BathIcon,
  SquareFoot as SizeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const ITEMS_PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function SearchResults() {
  const router = useRouter();
  const { location, propertyType, priceRange } = router.query;

  const [searchParams, setSearchParams] = useState({
    query: '',
    location: location || '',
    priceRange: priceRange ? priceRange.split(',') : [5000, 50000],
    propertyType: propertyType || 'all',
    sortBy: 'newest',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        ...(searchParams.query && { query: searchParams.query }),
        ...(searchParams.location && { location: searchParams.location }),
        ...(searchParams.priceRange && { price: { $lte: searchParams.priceRange[1] } }),
        ...(searchParams.propertyType && { type: searchParams.propertyType }),
        ...(searchParams.sortBy && { sort: searchParams.sortBy }),
      });

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/search?${params}`);
      const { data, pagination } = response.data;

      setProperties(data);
      setTotalPages(Math.ceil(pagination.total / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchProperties();
  }, [router.isReady, page, searchParams, location, propertyType, priceRange]);

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: {
        location: searchParams.location,
        propertyType: searchParams.propertyType,
        priceRange: searchParams.priceRange.join(','),
      },
    });
  };

  const handleFilterChange = (event) => {
    setSearchParams({
      ...searchParams,
      [event.target.name]: event.target.value,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setSearchParams({
      ...searchParams,
      priceRange: newValue,
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: '100vh',
        background: 'var(--primary-color)',
        py: 4,
      }}
    >
      <Navbar />
      <Container maxWidth="lg">
        {/* Search Bar */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          className="glass"
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '24px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search properties..."
                value={searchParams.query}
                onChange={(e) => handleFilterChange(e)}
                name="query"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'var(--accent-color)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    '& fieldset': {
                      borderColor: 'var(--glass-border)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Location"
                value={searchParams.location}
                onChange={(e) => handleFilterChange(e)}
                name="location"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'var(--accent-color)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    '& fieldset': {
                      borderColor: 'var(--glass-border)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--accent-color)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{
                  py: 1.5,
                  background: 'var(--accent-color)',
                  color: 'var(--text-primary)',
                  '&:hover': {
                    background: 'var(--accent-color)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
                  },
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                color: 'var(--text-secondary)',
                '&:hover': {
                  color: 'var(--accent-color)',
                },
              }}
            >
              Filters
            </Button>
            <Button
              startIcon={<Sort />}
              sx={{
                color: 'var(--text-secondary)',
                '&:hover': {
                  color: 'var(--accent-color)',
                },
              }}
            >
              Sort
            </Button>
          </Box>

          <AnimatePresence>
            {showFilters && (
              <Box
                component={motion.div}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                sx={{ mt: 2, overflow: 'hidden' }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'var(--text-secondary)',
                        mb: 1,
                      }}
                    >
                      Price Range (BDT)
                    </Typography>
                    <Slider
                      value={searchParams.priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={1000}
                      max={100000}
                      step={1000}
                      sx={{
                        color: 'var(--accent-color)',
                        '& .MuiSlider-thumb': {
                          backgroundColor: 'var(--accent-color)',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'var(--glass-border)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{
                          color: 'var(--text-secondary)',
                          '&.Mui-focused': {
                            color: 'var(--accent-color)',
                          },
                        }}
                      >
                        Property Type
                      </InputLabel>
                      <Select
                        value={searchParams.propertyType}
                        onChange={handleFilterChange}
                        name="propertyType"
                        sx={{
                          color: 'var(--text-primary)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--glass-border)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--accent-color)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--accent-color)',
                          },
                        }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="house">House</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}
          </AnimatePresence>
        </Paper>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {!loading && !error && (
          <>
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property._id}>
                  <motion.div variants={itemVariants}>
                    <PropertyCard property={property} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}

            {properties.length === 0 && (
              <Alert severity="info" sx={{ mt: 4 }}>
                No properties found matching your criteria.
              </Alert>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
