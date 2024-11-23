import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { LocationOn as LocationIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

const PropertyMap = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Fetch properties data
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/properties/locations');
      setProperties(response.data);
      
      // Update markers if map exists
      if (map && response.data) {
        updateMarkers(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch property locations');
      console.error('Property locations fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [map]);

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && !map) {
      // Check if Google Maps is loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    }

    return () => {
      // Cleanup markers
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
      }
    };
  }, []);

  // Initialize Google Map
  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 23.8103, lng: 90.4125 }, // Dhaka, Bangladesh
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    setMap(mapInstance);
    fetchProperties();
  };

  // Update markers on the map
  const updateMarkers = (properties) => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    properties.forEach(property => {
      if (property.location?.coordinates) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0],
          },
          map: map,
          title: property.title,
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: theme.palette.primary.main,
            fillOpacity: 0.8,
            strokeColor: theme.palette.primary.dark,
            strokeWeight: 2,
          },
        });

        // Add click listener
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0;">${property.title}</h3>
                <p style="margin: 0;">${property.address}</p>
                <p style="margin: 5px 0 0 0;">৳${property.price}/month</p>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  };

  // Debounced refresh function
  const debouncedRefresh = debounce(() => {
    fetchProperties();
  }, 1000);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ position: 'relative', height: '600px', mb: 3 }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            <Card>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Tooltip title="Refresh Properties">
                  <IconButton
                    onClick={debouncedRefresh}
                    disabled={loading}
                    size="small"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Box>

          <Box
            id="map"
            sx={{
              height: '100%',
              width: '100%',
            }}
          />
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Showing {markers.length} properties on the map
          </Typography>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyMap;
