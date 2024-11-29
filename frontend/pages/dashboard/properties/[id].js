import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  Users,
  Ruler,
  Check,
  Edit,
  Trash2,
  ChevronLeft,
  Calendar,
  DollarSign
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PropertyDetailsPage() {
  // Mock property data (replace with actual data fetching)
  const [property, setProperty] = useState({
    id: 1,
    title: 'Modern Apartment in Gulshan',
    description: 'A spacious and well-maintained apartment located in the heart of Gulshan, perfect for professionals and small families.',
    location: 'Gulshan 2, Dhaka',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    price: 45000,
    status: 'available',
    amenities: [
      'Parking', 'Gym', 'Swimming Pool', 
      'Security', 'Elevator', 'Air Conditioning'
    ],
    images: [
      '/images/properties/apartment1.jpg',
      '/images/properties/apartment2.jpg',
      '/images/properties/apartment3.jpg'
    ],
    tenants: 0,
    lastUpdated: '2024-01-15',
    owner: {
      name: 'Adib Rahman',
      email: 'adib@example.com',
      phone: '+880 1234 567890'
    }
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleDeleteProperty = () => {
    // Implement property deletion logic
    console.log('Delete property:', property.id);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>{property.title} - RentHouse BD</title>
      </Head>

      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div 
          variants={fadeInUp}
          className="flex items-center justify-between"
        >
          <Link 
            href="/dashboard/properties"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href={`/dashboard/properties/${property.id}/edit`}
              className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Property
            </Link>
            <button
              onClick={handleDeleteProperty}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Property
            </button>
          </div>
        </motion.div>

        {/* Property Images */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Main Image */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={property.images[activeImageIndex]}
              alt={property.title}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === activeImageIndex 
                      ? 'bg-primary-500' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-4">
            {property.images.map((image, index) => (
              <div 
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-32 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  index === activeImageIndex 
                    ? 'border-primary-500' 
                    : 'border-transparent hover:border-primary-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Property Details */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main Details */}
          <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {property.title}
              </h1>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                property.status === 'available'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {property.status === 'available' ? 'Available' : 'Rented'}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>

            <p className="text-gray-700 mb-6">
              {property.description}
            </p>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-primary-600" />
                <div>
                  <span className="block text-sm text-gray-600">Type</span>
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary-600" />
                <div>
                  <span className="block text-sm text-gray-600">Tenants</span>
                  <span className="font-semibold">{property.tenants}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Ruler className="w-6 h-6 mr-2 text-primary-600" />
                <div>
                  <span className="block text-sm text-gray-600">Area</span>
                  <span className="font-semibold">{property.area} sqft</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between bg-primary-50 rounded-lg p-4">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                <div>
                  <span className="block text-sm text-gray-600">Monthly Rent</span>
                  <span className="text-xl font-bold text-gray-900">
                    ৳{property.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  Last Updated: {new Date(property.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities and Owner Details */}
          <div className="space-y-6">
            {/* Amenities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map(amenity => (
                  <div 
                    key={amenity}
                    className="flex items-center text-gray-700"
                  >
                    <Check className="w-5 h-5 mr-2 text-primary-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Owner
              </h3>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {property.owner.name[0]}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {property.owner.name}
                </h4>
                <p className="text-gray-600 mb-2">{property.owner.email}</p>
                <p className="text-gray-600">{property.owner.phone}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
