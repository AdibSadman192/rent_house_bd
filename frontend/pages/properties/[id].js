import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Share2, Calendar } from 'lucide-react';

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
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 
                  ${activeImage === index ? 'border-primary-500' : 'border-transparent'}`}
              >
                <Image
                  src={image}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
              >
                {/* Title and Price */}
                <motion.div variants={fadeInUp} className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      ৳{property.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">/month</div>
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 p-6 bg-white rounded-lg shadow-sm mb-8">
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 text-gray-600 mr-2" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 text-gray-600 mr-2" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-5 h-5 text-gray-600 mr-2" />
                    <span>{property.area} sqft</span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div variants={fadeInUp} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </motion.div>

                {/* Features */}
                <motion.div variants={fadeInUp} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="sticky top-4"
              >
                {/* Contact Card */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-lg shadow-sm p-6 mb-6"
                >
                  <div className="flex items-center mb-6">
                    <Image
                      src={property.owner.image}
                      alt={property.owner.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{property.owner.name}</h3>
                      <p className="text-sm text-gray-600">Property Owner</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Owner
                    </button>
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {property.owner.phone}
                    </a>
                  </div>
                </motion.div>

                {/* Property Details Card */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium text-gray-900">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium text-gray-900">{new Date(property.availableFrom).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnished</span>
                      <span className="font-medium text-gray-900">{property.amenities.furnished ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet Friendly</span>
                      <span className="font-medium text-gray-900">{property.amenities.petFriendly ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h3>
            <form onSubmit={handleContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
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
