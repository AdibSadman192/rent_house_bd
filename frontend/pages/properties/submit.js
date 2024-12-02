import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Home, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  Check, 
  X, 
  Upload, 
  PlusCircle
} from 'lucide-react';

const PropertySubmission = () => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    price: '',
    location: {
      district: '',
      area: '',
      address: ''
    },
    amenities: [],
    images: [],
    availableFrom: '',
  });

  const [availableAmenities] = useState([
    'WiFi', 'AC', 'Parking', 'Elevator', 'Gym', 
    'Swimming Pool', 'Security', 'Balcony', 'Kitchen'
  ]);

  const [selectedImages, setSelectedImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setPropertyData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setPropertyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setPropertyData(prev => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    const imageUrls = validImageFiles.map(file => 
      URL.createObjectURL(file)
    );

    setSelectedImages(prev => [...prev, ...imageUrls]);
    setPropertyData(prev => ({
      ...prev,
      images: [...prev.images, ...validImageFiles]
    }));
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPropertyData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = [
      'title', 'description', 'type', 'bedrooms', 
      'bathrooms', 'area', 'price', 
      'location.district', 'location.area', 'location.address'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.includes('.') 
        ? propertyData.location[field.split('.')[1]] 
        : propertyData[field];
      return !value;
    });

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const formData = new FormData();
    Object.keys(propertyData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, JSON.stringify(propertyData[key]));
      }
    });

    propertyData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch('/api/properties/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Property submitted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Property submission error:', error);
      alert('An error occurred while submitting the property');
    }
  };

  return (
    <>
      <Head>
        <title>Submit Property | RentHouse BD</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6"
        >
          <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <Home className="mr-3" /> Submit Your Property
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={propertyData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Luxurious 2BHK in Gulshan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={propertyData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your property in detail"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  name="type"
                  value={propertyData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="duplex">Duplex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Area (sq. ft.)
                </label>
                <input
                  type="number"
                  name="area"
                  value={propertyData.area}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Property area"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={propertyData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={propertyData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Rent (BDT)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={propertyData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Monthly rent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={propertyData.availableFrom}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  name="location.district"
                  value={propertyData.location.district}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Rajshahi">Rajshahi</option>
                </select>

                <input
                  type="text"
                  name="location.area"
                  value={propertyData.location.area}
                  onChange={handleInputChange}
                  placeholder="Area/Neighborhood"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />

                <input
                  type="text"
                  name="location.address"
                  value={propertyData.location.address}
                  onChange={handleInputChange}
                  placeholder="Full Address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={propertyData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={amenity} 
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-blue-300 group">
                  <div className="flex flex-col items-center justify-center pt-7 cursor-pointer">
                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-blue-600" />
                    <p className="lowercase text-sm text-gray-400 group-hover:text-blue-600 pt-1 tracking-wider">
                      Select photos
                    </p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Check className="mr-2 h-5 w-5" />
                Submit Property
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

PropertySubmission.requireAuth = true;

export default PropertySubmission;
