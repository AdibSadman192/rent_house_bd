import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import Image from 'next/image';

const ImageUpload = ({ onUpload, maxFiles = 10, existingImages = [], onDelete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Preview files
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxFiles - existingImages.length,
    maxSize: 5242880 // 5MB
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await onUpload(formData, (progress) => {
        setUploadProgress(progress);
      });
      // Clear files after successful upload
      setFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (imageId) => {
    try {
      await onDelete(imageId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag & drop images here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          Max {maxFiles} images, up to 5MB each
        </Typography>
      </Box>

      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Existing Images
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {existingImages.map((image, index) => (
              <Box
                key={image._id}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100
                }}
              >
                <Image
                  src={image.url}
                  alt={`Property ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteExisting(image._id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'common.white'
                    }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Preview */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Images
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {files.map((file, index) => (
              <Box
                key={file.name}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100
                }}
              >
                <Image
                  src={file.preview}
                  alt={`Upload ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeFile(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'common.white'
                    }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
