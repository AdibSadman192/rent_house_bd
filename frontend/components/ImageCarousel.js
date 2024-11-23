import React, { useState } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import Image from 'next/image';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Main Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 400,
          cursor: 'pointer',
          '&:hover': {
            '& .MuiIconButton-root': {
              opacity: 1
            }
          }
        }}
        onClick={() => setModalOpen(true)}
      >
        <Image
          src={images[currentIndex].url}
          alt={`Property ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          priority
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.100'
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 3
            }
          }}
        >
          {images.map((image, index) => (
            <Box
              key={image._id}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                position: 'relative',
                width: 80,
                height: 60,
                flexShrink: 0,
                cursor: 'pointer',
                opacity: index === currentIndex ? 1 : 0.6,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
                style={{ borderRadius: 4 }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Fullscreen Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            bgcolor: 'background.paper',
            p: 2
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
          >
            <Image
              src={images[currentIndex].url}
              alt={`Property ${currentIndex + 1}`}
              layout="fill"
              objectFit="contain"
            />
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper'
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper'
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageCarousel;
