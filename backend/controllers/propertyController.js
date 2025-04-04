const Property = require('../models/Property');
const { getValidImageUrl } = require('../utils/imagePlaceholder');

// @desc    Get all properties with filtering, sorting, and pagination
// @route   GET /api/properties
// @access  Public
// @desc    Update real-time property status
// @route   PUT /api/properties/:id/status
// @access  Private
exports.updateRealTimeStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.realTimeStatus = {
      ...property.realTimeStatus,
      ...req.body,
      lastUpdated: Date.now()
    };

    await property.save();
    res.json({ success: true, data: property.realTimeStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get properties within radius
// @route   GET /api/properties/nearby
// @access  Public
exports.getNearbyProperties = async (req, res) => {
  try {
    const { longitude, latitude, radius } = req.query;

    // Validate coordinates
    if (!longitude || !latitude || !radius) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude, latitude and radius'
      });
    }

    // Find properties within radius (in kilometers)
    const properties = await Property.find({
      geolocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert to meters
        }
      }
    }).populate('owner', 'firstName lastName email phone avatar');

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Handle location search
    if (reqQuery.location) {
      reqQuery.location = { $regex: reqQuery.location, $options: 'i' };
    }

    // Handle property type
    if (reqQuery.type) {
      reqQuery.propertyType = reqQuery.type;
      delete reqQuery.type;
    }

    // Handle price range
    if (reqQuery.price) {
      try {
        reqQuery.price = JSON.parse(reqQuery.price);
      } catch (e) {
        delete reqQuery.price;
      }
    }

    // Handle bedrooms
    if (reqQuery.bedrooms) {
      try {
        reqQuery.bedrooms = JSON.parse(reqQuery.bedrooms);
      } catch (e) {
        delete reqQuery.bedrooms;
      }
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Property.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      const sortObj = {};
      sortObj[field] = order === 'desc' ? -1 : 1;
      query = query.sort(sortObj);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate owner details
    query = query.populate({
      path: 'owner',
      select: 'firstName lastName email phone avatar'
    });

    // Execute query
    const properties = await query;

    // Process images for each property
    const processedProperties = await Promise.all(properties.map(async (property) => {
      const propertyObj = property.toObject();
      
      // Process property images
      if (propertyObj.images && propertyObj.images.length > 0) {
        propertyObj.images = await Promise.all(propertyObj.images.map(async (image) => ({
          url: await getValidImageUrl(image.url, 'property', propertyObj.propertyType),
          alt: image.alt
        })));
      } else {
        // Add default image if no images exist
        propertyObj.images = [{
          url: await getValidImageUrl(null, 'property', propertyObj.propertyType),
          alt: `${propertyObj.propertyType} Default Image`
        }];
      }

      return propertyObj;
    }));

    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      count: processedProperties.length,
      pagination,
      data: processedProperties
    });
  } catch (error) {
    console.error('Error in getProperties:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate({
      path: 'owner',
      select: 'firstName lastName email phone'
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Process property images
    const propertyObj = property.toObject();
    if (propertyObj.images && propertyObj.images.length > 0) {
      propertyObj.images = await Promise.all(propertyObj.images.map(async (image) => ({
        url: await getValidImageUrl(image.url, 'property', propertyObj.propertyType),
        alt: image.alt
      })));
    } else {
      propertyObj.images = [{
        url: await getValidImageUrl(null, 'property', propertyObj.propertyType),
        alt: `${propertyObj.propertyType} Default Image`
      }];
    }

    res.status(200).json({
      success: true,
      data: propertyObj
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private/Renter
exports.createProperty = async (req, res) => {
  try {
    const { title, description, address, price, propertyType, images } = req.body;

    // Check if property already exists
    const propertyExists = await Property.findOne({ title, owner: req.user.id });
    if (propertyExists) {
      return res.status(400).json({
        success: false,
        message: 'Property with this title already exists for the owner'
      });
    }

    // Validate Bangladesh-specific fields
    if (!address.division || !address.district || !address.thana) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete Bangladesh address (division, district, and thana)'
      });
    }

    // Validate postal code format (Bangladesh)
    if (!/^\d{4}$/.test(address.postCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Bangladesh postal code (4 digits)'
      });
    }

    // Set default country
    address.country = 'Bangladesh';

    // Convert price to BDT if not specified
    if (!price.currency) {
      price.currency = 'BDT';
    }

    // Process images
    if (images && images.length > 0) {
      images = await Promise.all(images.map(async (image) => ({
        url: await getValidImageUrl(image.url, 'property', propertyType),
        alt: image.alt || `${propertyType} Image`
      })));
    } else {
      images = [{
        url: await getValidImageUrl(null, 'property', propertyType),
        alt: `${propertyType} Default Image`
      }];
    }

    // Create property
    const property = await Property.create({
      title,
      description,
      address,
      price,
      propertyType,
      images,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the property. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Renter
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Validate Bangladesh-specific fields
    if (req.body.address && (!req.body.address.division || !req.body.address.district || !req.body.address.thana)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete Bangladesh address (division, district, and thana)'
      });
    }

    // Validate postal code format (Bangladesh)
    if (req.body.address && req.body.address.postCode && !/^\d{4}$/.test(req.body.address.postCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Bangladesh postal code (4 digits)'
      });
    }

    // Set default country
    if (req.body.address) {
      req.body.address.country = 'Bangladesh';
    }

    // Convert price to BDT if not specified
    if (req.body.price && !req.body.price.currency) {
      req.body.price.currency = 'BDT';
    }

    // Process images
    if (req.body.images && req.body.images.length > 0) {
      req.body.images = await Promise.all(req.body.images.map(async (image) => ({
        url: await getValidImageUrl(image.url, 'property', req.body.propertyType),
        alt: image.alt || `${req.body.propertyType} Image`
      })));
    } else if (req.body.images && req.body.images.length === 0) {
      req.body.images = [{
        url: await getValidImageUrl(null, 'property', req.body.propertyType),
        alt: `${req.body.propertyType} Default Image`
      }];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the property. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Renter
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the property. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Add property rating
// @route   POST /api/properties/:id/ratings
// @access  Private
exports.addPropertyRating = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user already rated
    const existingRating = property.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this property'
      });
    }

    property.ratings.push({
      rating: req.body.rating,
      review: req.body.review,
      user: req.user.id
    });

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: property
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the rating. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Get properties within radius
// @route   GET /api/properties/radius/:zipcode/:distance
// @access  Public
exports.getPropertiesInRadius = async (req, res) => {
  try {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 km
    const radius = distance / 3963;

    const properties = await Property.find({
      location: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] }
      }
    });

    // Process images for each property
    const processedProperties = await Promise.all(properties.map(async (property) => {
      const propertyObj = property.toObject();
      
      // Process property images
      if (propertyObj.images && propertyObj.images.length > 0) {
        propertyObj.images = await Promise.all(propertyObj.images.map(async (image) => ({
          url: await getValidImageUrl(image.url, 'property', propertyObj.propertyType),
          alt: image.alt
        })));
      } else {
        // Add default image if no images exist
        propertyObj.images = [{
          url: await getValidImageUrl(null, 'property', propertyObj.propertyType),
          alt: `${propertyObj.propertyType} Default Image`
        }];
      }

      return propertyObj;
    }));

    res.status(200).json({
      success: true,
      count: processedProperties.length,
      data: processedProperties
    });
  } catch (error) {
    console.error('Error getting properties in radius:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while getting properties in radius. Please try again later.',
      error: error.message
    });
  }
};
