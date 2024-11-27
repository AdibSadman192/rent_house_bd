import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Autocomplete,
  Paper,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled Components
const HeroWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}22 0%, ${theme.palette.primary.main}11 100%)`,
  position: 'relative',
  overflow: 'hidden',
  paddingTop: theme.spacing(12),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(/images/hero-pattern.svg)',
    opacity: 0.1,
    zIndex: 0,
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: 'none',
  padding: theme.spacing(3),
  maxWidth: '800px',
  width: '100%',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
    zIndex: -1,
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
  },
}));

const locations = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
];

const propertyTypes = [
  'Apartment',
  'House',
  'Villa',
  'Studio',
  'Duplex',
  'Penthouse',
];

const HeroSection = () => {
  const [location, setLocation] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    // Implement search functionality
    console.log({ location, propertyType, budget });
  };

  return (
    <HeroWrapper>
      <Container maxWidth={false}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #3b0f6b 0%, #4f1c89 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Find Your Dream Home in Bangladesh
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Discover the perfect rental property that matches your lifestyle and budget
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard elevation={0}>
            <Box
              component="form"
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr auto' },
              }}
            >
              <Autocomplete
                value={location}
                onChange={(event, newValue) => setLocation(newValue)}
                options={locations}
                renderInput={(params) => (
                  <SearchTextField
                    {...params}
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

              <Autocomplete
                value={propertyType}
                onChange={(event, newValue) => setPropertyType(newValue)}
                options={propertyTypes}
                renderInput={(params) => (
                  <SearchTextField
                    {...params}
                    placeholder="Property Type"
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

              <SearchTextField
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Maximum Budget (৳)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{
                  height: '56px',
                  borderRadius: '12px',
                  px: 4,
                  background: 'linear-gradient(135deg, #006A4E 0%, #2E8B57 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #005A3E 0%, #1E7B47 100%)',
                  },
                }}
              >
                <SearchIcon sx={{ mr: 1 }} />
                Search
              </Button>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
              {[
                { label: '10,000+ Properties', icon: HomeIcon },
                { label: '8 Major Cities', icon: LocationIcon },
                { label: 'Budget Friendly', icon: MoneyIcon },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                    }}
                  >
                    <item.icon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {item.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </HeroWrapper>
  );
};

export default HeroSection;
