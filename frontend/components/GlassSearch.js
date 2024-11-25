import { useState } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Collapse,
  Chip,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn,
  AttachMoney,
  Hotel,
  Clear,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 0,
  },

  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',

    '&::before': {
      opacity: 1,
    },
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 2),
  position: 'relative',
  zIndex: 1,

  '& input': {
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  zIndex: 1,
}));

const FilterChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  background: selected ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.1)',
  border: `1px solid ${selected ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    background: selected ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 255, 255, 0.2)',
  },

  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },

  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
  },

  '& .MuiSlider-valueLabel': {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    borderRadius: '8px',
    padding: '4px 8px',
    color: theme.palette.text.primary,
    fontSize: '0.75rem',
  },
}));

const GlassSearch = ({ onSearch, initialFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [5000, 50000],
    location: [],
    amenities: [],
    propertyType: [],
    ...initialFilters,
  });

  const locations = [
    { label: 'Dhaka', icon: <LocationOn /> },
    { label: 'Chittagong', icon: <LocationOn /> },
    { label: 'Sylhet', icon: <LocationOn /> },
  ];

  const propertyTypes = [
    { label: 'Apartment', icon: <Hotel /> },
    { label: 'House', icon: <Hotel /> },
    { label: 'Studio', icon: <Hotel /> },
  ];

  const amenities = [
    'Furnished',
    'Air Conditioning',
    'Parking',
    'Security',
    'Generator',
    'Elevator',
  ];

  const handleSearch = () => {
    onSearch?.({ searchTerm, filters });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const toggleLocation = (location) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...filters.location, location];
    handleFilterChange('location', newLocations);
  };

  const togglePropertyType = (type) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter(t => t !== type)
      : [...filters.propertyType, type];
    handleFilterChange('propertyType', newTypes);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilters({
      priceRange: [5000, 50000],
      location: [],
      amenities: [],
      propertyType: [],
    });
  };

  return (
    <SearchContainer elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <SearchInput
          placeholder="Search for properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterIcon />
        </IconButton>
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <FilterContainer>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney />
                Price Range (BDT)
              </Box>
              <IconButton size="small" onClick={handleClear}>
                <Clear fontSize="small" />
              </IconButton>
            </Box>
            <PriceSlider
              value={filters.priceRange}
              onChange={(_, value) => handleFilterChange('priceRange', value)}
              min={1000}
              max={100000}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `৳${value.toLocaleString()}`}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn />
              Location
            </Box>
            <Box>
              {locations.map(({ label, icon }) => (
                <FilterChip
                  key={label}
                  icon={icon}
                  label={label}
                  onClick={() => toggleLocation(label)}
                  selected={filters.location.includes(label)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Hotel />
              Property Type
            </Box>
            <Box>
              {propertyTypes.map(({ label, icon }) => (
                <FilterChip
                  key={label}
                  icon={icon}
                  label={label}
                  onClick={() => togglePropertyType(label)}
                  selected={filters.propertyType.includes(label)}
                />
              ))}
            </Box>
          </Box>

          <FormControl component="fieldset">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              Amenities
            </Box>
            <FormGroup>
              {amenities.map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      checked={filters.amenities.includes(amenity)}
                      onChange={(e) => {
                        const newAmenities = e.target.checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter(a => a !== amenity);
                        handleFilterChange('amenities', newAmenities);
                      }}
                    />
                  }
                  label={amenity}
                />
              ))}
            </FormGroup>
          </FormControl>
        </FilterContainer>
      </Collapse>
    </SearchContainer>
  );
};

export default GlassSearch;
