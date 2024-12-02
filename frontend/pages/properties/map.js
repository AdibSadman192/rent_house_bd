import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  MapPin,
  Filter,
  Home,
  DollarSign,
  Bed,
  Search,
} from 'lucide-react';

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

  useEffect(() => {
    // Fetch properties with location data
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/map');
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = useCallback(() => {
    let result = properties;

    // Search filter
    if (searchTerm) {
      result = result.filter(prop => 
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(prop => prop.type === filters.type);
    }

    // Price filter
    result = result.filter(prop => 
      prop.price >= filters.minPrice && 
      prop.price <= filters.maxPrice
    );

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      result = result.filter(prop => prop.bedrooms === parseInt(filters.bedrooms));
    }

    setFilteredProperties(result);
  }, [properties, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const renderPropertyMarker = (property) => {
    if (!property.coordinates) return null;

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
              <span>৳{property.price.toLocaleString()}/month</span>
            </div>
            <div className="flex items-center">
              <Bed className="mr-2 h-4 w-4 text-purple-500" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      <Head>
        <title>Property Map View | RentHouse BD</title>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <MapPin className="mr-3 text-blue-600" /> 
            Property Map View
          </h1>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Property Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
            </select>

            <select
              value={filters.bedrooms}
              onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
              className="w-full py-2 border rounded-md"
            >
              <option value="all">All Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                className="w-full py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Map Container */}
          <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={mapCenter}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredProperties.map(renderPropertyMarker)}
            </MapContainer>
          </div>

          {/* Property List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {filteredProperties.length} Properties Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProperties.map(property => (
                <div 
                  key={property.id} 
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${property.images[0]})` }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center mb-1">
                      <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xl font-bold text-blue-600">
                        ৳{property.price.toLocaleString()}/month
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Bed className="mr-1 h-4 w-4" />
                        {property.bedrooms} Beds
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PropertyMapView;
