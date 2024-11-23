import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Typography,
  Grid,
  Collapse,
  Autocomplete,
  InputAdornment,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Home as HomeIcon,
  Hotel as HotelIcon,
  Bathtub as BathtubIcon,
  AttachMoney as MoneyIcon,
  SquareFoot as SquareFootIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';

const SearchFilters = ({ 
  onFilterChange,
  initialFilters = {},
  locations = [],
  propertyTypes = []
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    propertyType: '',
    priceRange: [0, 100000],
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    ...initialFilters
  });

  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [selectedAmenities, setSelectedAmenities] = useState(filters.amenities);

  const amenitiesList = [
    'Air Conditioning',
    'Parking',
    'Swimming Pool',
    'Gym',
    'Security',
    'Elevator',
    'Internet',
    'Furnished',
    'Balcony',
    'Garden'
  ];

  const handleSearchChange = debounce((value) => {
    handleFilterChange('search', value);
  }, 500);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceRangeChangeCommitted = (event, newValue) => {
    handleFilterChange('priceRange', newValue);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newAmenities);
    handleFilterChange('amenities', newAmenities);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      propertyType: '',
      priceRange: [0, 100000],
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: []
    };
    setFilters(clearedFilters);
    setPriceRange(clearedFilters.priceRange);
    setSelectedAmenities([]);
    onFilterChange(clearedFilters);
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 2,
        mb: 3,
        position: 'sticky',
        top: 16,
        zIndex: 10,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search properties..."
          variant="outlined"
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1, minWidth: 'auto', px: 3 }}
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          <FilterListIcon />
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={locations}
              value={filters.location}
              onChange={(event, newValue) => handleFilterChange('location', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Location"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                label="Property Type"
                startAdornment={
                  <InputAdornment position="start">
                    <HomeIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Types</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Bedrooms</InputLabel>
              <Select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                label="Bedrooms"
                startAdornment={
                  <InputAdornment position="start">
                    <HotelIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Any</MenuItem>
                {[1, 2, 3, 4, '5+'].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === '5+' ? 'or more' : num === 1 ? 'Bedroom' : 'Bedrooms'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Price Range (৳)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                onChangeCommitted={handlePriceRangeChangeCommitted}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                valueLabelFormat={(value) => `৳${value.toLocaleString()}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ৳{priceRange[0].toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ৳{priceRange[1].toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {amenitiesList.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  color={selectedAmenities.includes(amenity) ? 'primary' : 'default'}
                  variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ mr: 1 }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={() => onFilterChange(filters)}
                startIcon={<SearchIcon />}
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default SearchFilters;
