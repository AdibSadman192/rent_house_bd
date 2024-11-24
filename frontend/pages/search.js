import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Hotel as BedIcon,
  Bathroom as BathIcon,
  SquareFoot as SizeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ITEMS_PER_PAGE = 12;

export default function SearchResults() {
  const router = useRouter();
  const { location, propertyType, priceRange } = router.query;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'price_asc',
    minBeds: '',
    maxPrice: '',
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        ...(location && { location }),
        ...(propertyType && { type: propertyType }),
        ...(priceRange && { price: { $lte: priceRange } }),
        ...(filters.sortBy && { sort: filters.sortBy.replace('_', ':') }),
        ...(filters.minBeds && { bedrooms: { $gte: filters.minBeds } }),
        ...(filters.maxPrice && { price: { $lte: filters.maxPrice } })
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
  }, [router.isReady, page, filters, location, propertyType, priceRange]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results
            {location && ` in ${location}`}
          </Typography>
          
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="date_desc">Newest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="minBeds"
                label="Min Bedrooms"
                value={filters.minBeds}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="maxPrice"
                label="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </Grid>
          </Grid>

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

          {/* Property Grid */}
          {!loading && !error && (
            <>
              <Grid container spacing={3}>
                {properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property._id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          transition: 'all 0.2s ease-in-out',
                        },
                      }}
                      onClick={() => router.push(`/properties/${property._id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={property.images[0] || '/placeholder.jpg'}
                        alt={property.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {property.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <LocationIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {property.location}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Chip
                            icon={<BedIcon />}
                            label={`${property.bedrooms} Beds`}
                            size="small"
                          />
                          <Chip
                            icon={<BathIcon />}
                            label={`${property.bathrooms} Baths`}
                            size="small"
                          />
                          <Chip
                            icon={<SizeIcon />}
                            label={`${property.size} sqft`}
                            size="small"
                          />
                        </Stack>
                        <Typography variant="h6" color="primary">
                          ৳{property.price.toLocaleString()}/month
                        </Typography>
                      </CardContent>
                    </Card>
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
        </Box>
      </Container>
    </Box>
  );
}
