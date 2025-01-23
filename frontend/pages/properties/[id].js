import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Share2, Calendar } from 'lucide-react';
import Link from 'next/link';

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

export default function PropertyDetailsPage({ property }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // Sample property data (will be replaced with API data)
  property = {
    id: 1,
    title: 'Modern Apartment in Gulshan',
    description: 'A beautiful and spacious apartment located in the heart of Gulshan. This property features modern amenities, high-end finishes, and stunning city views. Perfect for families or professionals looking for a premium living experience.',
    location: 'Gulshan 2, Dhaka',
    price: 45000,
    images: [
      '/images/properties/apartment1.jpg',
      '/images/properties/apartment2.jpg',
      '/images/properties/apartment3.jpg',
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'Apartment',
    features: [
      'Modern Kitchen',
      'Central AC',
      'High-speed Internet',
      'Parking Space',
      '24/7 Security',
      'Backup Generator',
      'Elevator',
      'Balcony'
    ],
    amenities: {
      furnished: true,
      parking: true,
      petFriendly: true,
      security: true,
      maintenance: true,
    },
    owner: {
      name: 'John Doe',
      phone: '+880 1234567890',
      email: 'john@example.com',
      image: '/images/avatar.jpg'
    },
    agent: {
      id: 1,
      name: 'Jane Doe',
      image: '/images/avatar.jpg',
      properties: 10
    },
    availableFrom: '2024-02-01'
  };

  const handleContact = (e) => {
    e.preventDefault();
    // Handle contact form submission
    setShowContactForm(false);
  };

  return (
    <>
      <Head>
        <title>{property.title} - RentHouse BD</title>
        <meta 
          name="description" 
          content={property.description.substring(0, 160)} 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Property Images */}
        <div className="relative h-[60vh] bg-gray-900">
          <Image
            src={property.images[activeImage]}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto p-2 bg-black/30 rounded-lg">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden 
                  ${activeImage === index ? 'ring-2 ring-primary-500' : ''}`}
              >
                <Image
                  src={image}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              onClick={() => {/* Implement share functionality */}}
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              onClick={() => {/* Implement favorite functionality */}}
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <div className="text-2xl font-bold text-primary-600">
                  ৳{property.price.toLocaleString()}<span className="text-sm text-gray-500">/month</span>
                </div>
              </div>
              <div className="flex items-center text-gray-500 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{property.area} sqft</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Available {new Date(property.availableFrom).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-[400px] bg-gray-100 rounded-lg">
                {/* Integrate Google Maps or Leaflet here */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Map integration coming soon
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={property.owner.image}
                    alt={property.owner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{property.owner.name}</h3>
                  <p className="text-sm text-gray-500">Property Owner</p>
                </div>
              </div>
              
              {showContactForm ? (
                <form onSubmit={handleContact} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Contact Owner
                  </button>
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </a>
                </div>
              )}
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Similar Properties</h3>
              <div className="space-y-4">
                {/* Add similar properties component */}
                <p className="text-gray-500 text-center">Similar properties coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  // Fetch property data based on params.id
  // For now, we're using static data
  return {
    props: {
      property: null // Will be populated with API data
    }
  };
}
