import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { FaVrCardboard } from 'react-icons/fa';

const VirtualTour = ({ tourData, isLoading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (tourData?.url && containerRef.current) {
      // Initialize virtual tour viewer
      // You can integrate with services like Matterport, 3DVista, or custom 360 viewers
      const iframe = document.createElement('iframe');
      iframe.src = tourData.url;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      containerRef.current.appendChild(iframe);

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
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