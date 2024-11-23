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
import propertyService from '../services/propertyService';
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

  useEffect(() => {
    if (!router.isReady) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const searchParams = {
          location,
          propertyType,
          priceRange,
          page,
          limit: ITEMS_PER_PAGE,
          ...filters,
        };

        const response = await propertyService.searchProperties(searchParams);
        setProperties(response.properties);
        setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [router.isReady, location, propertyType, priceRange, page, filters]);

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

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results
          </Typography>
          <Typography color="text.secondary">
            {properties.length} properties found
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
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
                  <MenuItem value="date_asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="minBeds"
                label="Minimum Bedrooms"
                value={filters.minBeds}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="maxPrice"
                label="Maximum Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Property Grid */}
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image}
                  alt={property.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {property.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
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
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    variant="contained"
                    component="a"
                    href={`/properties/${property.id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </>
  );
}
