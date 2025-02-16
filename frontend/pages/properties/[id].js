import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Share2, Calendar, CheckCircle } from 'lucide-react';
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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Property Images */}
        <div className="relative h-[70vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={property.images[activeImage]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
          </motion.div>

          {/* Image Navigation */}
          <div className="absolute bottom-6 left-4 right-4 flex gap-2 overflow-x-auto p-2 backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative flex-shrink-0 h-16 w-24 rounded-xl overflow-hidden transition-all duration-200 ${
                  activeImage === index ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                }`}
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
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div 
              variants={stagger}
              initial="initial"
              animate="animate"
              className="lg:col-span-2 space-y-8"
            >
              {/* Title and Location */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="text-3xl font-bold text-primary-600">
                  ৳{property.price.toLocaleString()}/month
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
                <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 flex items-center space-x-3 border border-gray-200/50">
                  <Bed className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 flex items-center space-x-3 border border-gray-200/50">
                  <Bath className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 flex items-center space-x-3 border border-gray-200/50">
                  <Square className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Area</div>
                    <div className="font-semibold">{property.area} sqft</div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeInUp} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </motion.div>

              {/* Features */}
              <motion.div variants={fadeInUp} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {/* Contact Card */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={property.owner.image}
                      alt={property.owner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property.owner.name}</h3>
                    <p className="text-gray-500">Property Owner</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Contact Owner</span>
                  </button>
                  
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="w-full py-3 bg-white text-primary-500 rounded-xl border border-primary-500 hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call Owner</span>
                  </a>
                </div>

                {showContactForm && (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleContact}
                    className="mt-6 space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows="4"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-200"
                    >
                      Send Message
                    </button>
                  </motion.form>
                )}
              </div>

              {/* Availability */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-lg mb-4">Availability</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Share */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-gray-200/50">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Show toast notification
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share Property</span>
                </button>
              </div>
            </motion.div>
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
