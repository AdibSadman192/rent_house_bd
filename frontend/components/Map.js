import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
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
import { useRouter } from 'next/router';

const MapComponent = ({ properties, height, center, zoom, onMarkerClick, interactive }) => {
  const router = useRouter();
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(center);

  return (
    <Box
      sx={{
        height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Loading map...
      </Typography>
    </Box>
  );
};

// Create a dynamic import of the Map component with SSR disabled
const Map = dynamic(
  () => import('./DynamicMap').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          height: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading map...
        </Typography>
      </Box>
    ),
  }
);

Map.defaultProps = {
  properties: [],
  height: 400,
  center: [23.8103, 90.4125], // Default to Dhaka, Bangladesh
  zoom: 13,
  interactive: true,
};

export default Map;
