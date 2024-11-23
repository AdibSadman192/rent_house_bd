import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as MyLocationIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/router';

const MapControls = ({ onZoomIn, onZoomOut, onLocate }) => (
  <Paper
    elevation={3}
    sx={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      p: 1,
      bgcolor: 'background.paper',
    }}
  >
    <Tooltip title="Zoom In" placement="left" TransitionComponent={Zoom}>
      <IconButton onClick={onZoomIn} size="small">
        <ZoomInIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Zoom Out" placement="left" TransitionComponent={Zoom}>
      <IconButton onClick={onZoomOut} size="small">
        <ZoomOutIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="My Location" placement="left" TransitionComponent={Zoom}>
      <IconButton onClick={onLocate} size="small">
        <MyLocationIcon />
      </IconButton>
    </Tooltip>
  </Paper>
);

const MapEvents = ({ onMove }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMove(center);
    },
  });
  return null;
};

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const DynamicMap = ({ properties = [], height = 400, center = [23.8103, 90.4125], zoom = 13, onMarkerClick, interactive = true }) => {
  const router = useRouter();
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [userLocation, setUserLocation] = useState(null);

  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Custom marker icon for properties
  const propertyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleMarkerClick = (property) => {
    if (onMarkerClick) {
      onMarkerClick(property);
    } else {
      router.push(`/properties/${property._id}`);
    }
  };

  const handleMapMove = (center) => {
    setMapCenter([center.lat, center.lng]);
  };

  return (
    <Box sx={{ position: 'relative', height, width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={interactive}
        dragging={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <MapEvents onMove={handleMapMove} />
        
        {properties.map((property) => (
          <Marker
            key={property._id}
            position={property.location.coordinates}
            icon={propertyIcon}
            eventHandlers={{
              click: () => handleMarkerClick(property),
            }}
          >
            <Popup>
              <Card sx={{ maxWidth: 300, boxShadow: 'none' }}>
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    {property.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.location.address}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ৳{property.price.toLocaleString()}/month
                  </Typography>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      {interactive && (
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocate={handleLocate}
        />
      )}
    </Box>
  );
};

export default DynamicMap;
