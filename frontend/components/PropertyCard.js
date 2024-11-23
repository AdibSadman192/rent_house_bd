import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Skeleton,
  Rating,
  Tooltip,
  Badge,
  Zoom
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Hotel as HotelIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Verified as VerifiedIcon,
  WhatsApp as WhatsAppIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Image from 'next/image';

const PropertyCard = ({ 
  property, 
  onFavoriteToggle,
  isFavorite: initialIsFavorite = false,
  variant = 'default' // 'default' | 'compact' | 'featured'
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/favorites/${property._id}`,
        { action: isFavorite ? 'remove' : 'add' }
      );
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(property._id, !isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setLoading(false);
  };

  const handleCardClick = () => {
    router.push(`/properties/${property._id}`);
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    if (property.whatsapp) {
      window.open(`https://wa.me/${property.whatsapp}`, '_blank');
    }
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <Box
          sx={{
            height: variant === 'compact' ? 150 : 200,
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography color="text.secondary">Image not available</Typography>
        </Box>
      );
    }

    return (
      <CardMedia
        component="div"
        sx={{
          height: variant === 'compact' ? 150 : 200,
          position: 'relative'
        }}
      >
        <Image
          src={property.images[0]}
          alt={property.title}
          layout="fill"
          objectFit="cover"
          onError={() => setImageError(true)}
        />
        {property.verified && (
          <Chip
            icon={<VerifiedIcon />}
            label="Verified"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)'
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1
          }}
        >
          <Tooltip title={`${property.views || 0} views`} TransitionComponent={Zoom}>
            <Chip
              icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
              label={property.views || 0}
              size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
            />
          </Tooltip>
          <IconButton
            onClick={handleFavoriteClick}
            disabled={loading}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.95)'
              }
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
      </CardMedia>
    );
  };

  return (
    <Card
      elevation={variant === 'featured' ? 3 : 1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        ...(variant === 'featured' && {
          border: '2px solid',
          borderColor: 'primary.main'
        })
      }}
      onClick={handleCardClick}
    >
      {renderImage()}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant={variant === 'compact' ? 'h6' : 'h5'}
            component="h2"
            noWrap
            gutterBottom
          >
            {property.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon color="action" sx={{ mr: 0.5, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {property.location}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          ৳{property.price.toLocaleString()}/month
        </Typography>

        {variant !== 'compact' && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {property.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<HotelIcon sx={{ fontSize: 18 }} />}
            label={`${property.bedrooms} Beds`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<BathtubIcon sx={{ fontSize: 18 }} />}
            label={`${property.bathrooms} Baths`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<SquareFootIcon sx={{ fontSize: 18 }} />}
            label={`${property.area} sqft`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Rating
              value={property.rating || 0}
              readOnly
              size="small"
              precision={0.5}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              {property.reviews?.length || 0} reviews
            </Typography>
          </Box>
          
          {property.whatsapp && (
            <Tooltip title="Contact on WhatsApp">
              <IconButton
                color="success"
                onClick={handleWhatsAppClick}
                size="small"
              >
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {variant === 'featured' && (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCardClick}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
