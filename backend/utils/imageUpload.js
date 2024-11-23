const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create upload directory if it doesn't exist
const createUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'properties');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Process uploaded image
const processImage = async (file) => {
  const uploadDir = createUploadDir();
  const filename = `processed-${file.filename}`;
  const outputPath = path.join(uploadDir, filename);

  try {
    // Resize and optimize image
    await sharp(file.path)
      .resize(800, 600, { // Standard size for property images
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convert to JPEG and compress
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(file.path);

    // Return processed image details
    return {
      url: `/uploads/properties/${filename}`,
      filename: filename
    };
  } catch (error) {
    // If something goes wrong, delete both files
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    throw error;
  }
};

// Delete image
const deleteImage = (filename) => {
  const filepath = path.join(process.cwd(), 'public', 'uploads', 'properties', filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

module.exports = {
  processImage,
  deleteImage,
  createUploadDir
};
