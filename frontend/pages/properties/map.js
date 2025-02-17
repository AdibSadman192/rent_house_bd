import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  DollarSign,
  Bed
} from 'lucide-react';
import Head from 'next/head';

// Dynamically import react-leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const PropertyMapView = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); // Dhaka center
  const [filters, setFilters] = useState({
    type: 'all',
    minPrice: 0,
    maxPrice: 100000,
    bedrooms: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleMapCenter = useCallback((lat, lng) => {
    setMapCenter([lat, lng]);
  }, []);

  const applyFilters = useCallback(() => {
    let result = properties;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(prop => 
        prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(prop => prop.type === filters.type);
    }

    // Apply price filter
    result = result.filter(prop => 
      prop.price >= filters.minPrice && 
      prop.price <= filters.maxPrice
    );

    // Apply bedrooms filter
    if (filters.bedrooms !== 'all') {
      result = result.filter(prop => prop.bedrooms === parseInt(filters.bedrooms));
    }

    setFilteredProperties(result);
  }, [properties, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const renderPropertyMarker = useCallback((property) => {
    if (!property?.coordinates) return null;

    return (
      <Marker 
        key={property.id} 
        position={[property.coordinates.lat, property.coordinates.lng]}
      >
        <Popup>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{property.title}</h3>
            <div className="flex items-center mb-1">
              <MapPin className="mr-2 h-4 w-4 text-blue-500" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center mb-1">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              <span>৳{property.price?.toLocaleString()}/month</span>
            </div>
            <div className="flex items-center">
              <Bed className="mr-2 h-4 w-4 text-purple-500" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }, []);

  return (
    <>
      <Head>
        <title>Property Map View | RentHouse BD</title>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location or property name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                </select>
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                >
                  <option value="all">All Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-24 px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-24 px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[calc(100vh-12rem)] w-full rounded-lg overflow-hidden shadow-lg"
          >
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredProperties.map(renderPropertyMarker)}
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PropertyMapView;
