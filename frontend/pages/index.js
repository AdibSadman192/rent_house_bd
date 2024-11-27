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
  Stack,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Autocomplete,
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
import { motion } from 'framer-motion';
import propertyService from '../services/propertyService';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
  });

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredProps, locationData, propertyTypeData] = await Promise.all([
          propertyService.getFeaturedProperties(6),
          propertyService.getLocations(),
          propertyService.getPropertyTypes()
        ]);

        setFeaturedProperties(featuredProps);
        setLocations(locationData);
        setPropertyTypes(propertyTypeData);
      } catch (err) {
        console.error('Error fetching data:', err);
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

  // Search Bar Component
  const SearchBar = () => (
    <Paper
      component={motion.div}
      whileHover={{ y: -5 }}
      elevation={0}
      className="glass"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        maxWidth: '600px',
      }}
    >
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
                  <LocationIcon sx={{ color: 'var(--accent-color)' }} />
                </InputAdornment>
              ),
              sx: { color: 'var(--text-primary)' },
            }}
          />
        )}
      />
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
                  <HomeIcon sx={{ color: 'var(--accent-color)' }} />
                </InputAdornment>
              ),
              sx: { color: 'var(--text-primary)' },
            }}
          />
        )}
      />
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
              <PriceIcon sx={{ color: 'var(--accent-color)' }} />
            </InputAdornment>
          ),
          sx: { color: 'var(--text-primary)' },
        }}
      >
        <option value="">Any Price</option>
        <option value="0-15000">৳0 - ৳15,000</option>
        <option value="15000-30000">৳15,000 - ৳30,000</option>
        <option value="30000-50000">৳30,000 - ৳50,000</option>
        <option value="50000+">৳50,000+</option>
      </TextField>
      <Button
        variant="contained"
        className="btn-primary"
        endIcon={<ArrowForward />}
        onClick={handleSearch}
      >
        Search
      </Button>
    </Paper>
  );

  // Property Card Component
  const PropertyCard = ({ property }) => (
    <Card
      component={motion.div}
      whileHover={{ y: -10 }}
      className="property-card"
      sx={{ height: '100%', background: 'transparent' }}
    >
      <Box sx={{ position: 'relative', paddingTop: '66.67%' }}>
        <Image
          src={property.image}
          alt={property.title}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: 'var(--text-primary)' }}
        >
          {property.title}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            <BedIcon sx={{ mr: 1, fontSize: '1rem' }} />
            {property.beds} Beds
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            <BathIcon sx={{ mr: 1, fontSize: '1rem' }} />
            {property.baths} Baths
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            <SizeIcon sx={{ mr: 1, fontSize: '1rem' }} />
            {property.size} sqft
          </Typography>
        </Stack>
        <Typography
          variant="h6"
          sx={{ color: 'var(--accent-color)', fontWeight: 600 }}
        >
          ৳{property.price.toLocaleString()}/month
        </Typography>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          href={`/properties/${property.id}`}
          endIcon={<ArrowForward />}
          sx={{
            mt: 2,
            py: 1,
            backgroundColor: 'var(--accent-color)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              backgroundColor: 'var(--accent-color-dark)',
            }
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <HeroSection />
      <FeaturedProperties />
    </Box>
  );
}

export default withAuth(Home, { requireAuth: false });
