import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    location,
    price,
    images,
    bedrooms,
    bathrooms,
    area,
    type,
    isFeatured,
  } = property;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-soft overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isFeatured && (
          <span className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
            Featured
          </span>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-primary-50 transition-colors">
          <Heart className="w-5 h-5 text-primary-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type & Price */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {type}
          </span>
          <div className="text-right">
            <span className="block text-xl font-bold text-gray-900">
              ৳{price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Link href={`/properties/${id}`} className="hover:text-primary-600 transition-colors">
            {title}
          </Link>
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-700">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm">{bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Bath className="w-4 h-4 mr-1" />
            <span className="text-sm">{bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Square className="w-4 h-4 mr-1" />
            <span className="text-sm">{area} sqft</span>
          </div>
        </div>
      </div>

      {/* View Details Link - Overlay */}
      <Link
        href={`/properties/${id}`}
        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
        aria-label={`View details for ${title}`}
      />
    </motion.div>
  );
};

export default PropertyCard;
