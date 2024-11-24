import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import { formatPrice, truncateText } from '../../../utils/format';

const PropertyCard = ({
  property,
  onFavorite,
  isFavorite = false,
  showActions = true,
  elevation = 1
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [shareDialog, setShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handlePropertyClick = () => {
    router.push(`/properties/${property._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(property._id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShareUrl(window.location.origin + '/properties/' + property._id);
    setShareDialog(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareDialog(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Card 
        elevation={elevation}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
        onClick={handlePropertyClick}
      >
        <CardMedia
          component="div"
          sx={{
            position: 'relative',
            height: 200,
            backgroundColor: 'grey.100'
          }}
        >
          {property.images && property.images[0] && (
            <Image
              src={property.images[0]}
              alt={property.title}
              layout="fill"
              objectFit="cover"
              priority
            />
          )}
          {showActions && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1
              }}
            >
              {user && (
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                  onClick={handleFavoriteClick}
                >
                  {isFavorite ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              )}
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
                onClick={handleShare}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          )}
          <Chip
            label={property.type}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          />
        </CardMedia>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {truncateText(property.title, 50)}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {property.location}
            </Typography>
          </Box>

          <Typography variant="h6" color="primary" gutterBottom>
            {formatPrice(property.price)}/month
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            {property.amenities?.slice(0, 3).map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                variant="outlined"
              />
            ))}
            {property.amenities?.length > 3 && (
              <Chip
                label={`+${property.amenities.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>

        {showActions && (
          <CardActions>
            <Button size="small" color="primary">
              View Details
            </Button>
            <Button size="small" color="primary">
              Contact Owner
            </Button>
          </CardActions>
        )}
      </Card>

      <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
        <DialogTitle>Share Property</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Copy the link below to share this property:
          </Typography>
          <Typography variant="body1" mt={1}>
            {shareUrl}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button onClick={handleCopyLink} variant="contained">
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PropertyCard;
