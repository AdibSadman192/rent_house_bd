import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import VirtualTour from '../../../components/properties/VirtualTour';
import useSocket from '../../../hooks/useSocket';

const VirtualTourPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const socket = useSocket();
  const [property, setProperty] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch property details
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
        setIsAvailable(data.isAvailable);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();

    // Setup real-time availability updates
    if (socket) {
      socket.emit('join_property_room', id);
      socket.on('property_availability_update', (data) => {
        if (data.propertyId === id) {
          setIsAvailable(data.isAvailable);
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave_property_room', id);
        socket.off('property_availability_update');
      }
    };
  }, [id, socket]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Virtual Tour</h2>
          <span
            className={`px-4 py-2 rounded-full ${isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
          >
            {isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>

        <VirtualTour panoramaUrl={property.virtualTourUrl} />

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Property Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium">${property.price}</p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="font-medium">{property.location}</p>
            </div>
            <div>
              <p className="text-gray-600">Bedrooms</p>
              <p className="font-medium">{property.bedrooms}</p>
            </div>
            <div>
              <p className="text-gray-600">Bathrooms</p>
              <p className="font-medium">{property.bathrooms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourPage;