import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { FaVrCardboard } from 'react-icons/fa';
import virtualTourService from '../../services/virtualTourService';

const VirtualTour = ({ tourData, isLoading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (tourData?.panoramaUrl && containerRef.current) {
      // Initialize WebGL viewer
      virtualTourService.initialize(containerRef.current);
      virtualTourService.loadPanorama(tourData.panoramaUrl)
        .then(() => {
          virtualTourService.animate();
        })
        .catch((error) => {
          console.error('Failed to load panorama:', error);
        });

      return () => {
        virtualTourService.dispose();
      };
    }
  }, [tourData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!tourData?.enabled) {
    return (
      <Alert status="info">
        <AlertIcon />
        Virtual tour is not available for this property.
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        ref={containerRef}
        h="400px"
        bg="gray.100"
        borderRadius="md"
        overflow="hidden"
        position="relative"
      />
      {tourData?.type && (
        <Text mt={2} color="gray.600">
          <FaVrCardboard style={{ display: 'inline', marginRight: '8px' }} />
          {tourData.type} Virtual Tour
        </Text>
      )}
      <Button
        mt={4}
        colorScheme="blue"
        leftIcon={<FaVrCardboard />}
        onClick={() => window.open(tourData.url, '_blank')}
        isDisabled={!tourData?.url}
      >
        Open Full Screen Tour
      </Button>
    </Box>
  );
};

export default VirtualTour;