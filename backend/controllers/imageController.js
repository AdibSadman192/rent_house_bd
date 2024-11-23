const Property = require('../models/Property');
const { processImage, deleteImage } = require('../utils/imageUpload');

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private/Renter
exports.uploadPropertyImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to upload images for this property'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const processedImages = [];
    for (const file of req.files) {
      const processedImage = await processImage(file);
      processedImages.push({
        url: processedImage.url,
        caption: req.body.captions ? req.body.captions[file.originalname] : ''
      });
    }

    // Add new images to property
    property.images.push(...processedImages);
    await property.save();

    res.status(200).json({
      success: true,
      data: property.images
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private/Renter
exports.deletePropertyImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete images for this property'
      });
    }

    const image = property.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete image file
    const filename = image.url.split('/').pop();
    deleteImage(filename);

    // Remove image from property
    image.remove();
    await property.save();

    res.status(200).json({
      success: true,
      data: property.images
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
