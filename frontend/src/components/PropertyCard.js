import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  Home,
  Person,
  Share
} from '@mui/icons-material';
import SavePostButton from './SavePostButton';

function PropertyCard({ post, showSaveButton = true }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.propertyType} for Rent in ${post.area}`,
        text: `Check out this ${post.propertyType} in ${post.area} for ${post.rent} BDT`,
        url: window.location.href,
      });
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={post.images[0]}
        alt={post.propertyType}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h2" gutterBottom>
            {post.propertyType}
          </Typography>
          <Box>
            {showSaveButton && <SavePostButton postId={post._id} />}
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {post.area}, {post.city}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <AttachMoney color="action" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            {post.rent.toLocaleString()} BDT
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            /month
          </Typography>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <Home color="action" sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                {post.bedrooms} bed • {post.bathrooms} bath
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <Person color="action" sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                {post.tenantType}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
          {post.amenities.slice(0, 3).map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              variant="outlined"
            />
          ))}
          {post.amenities.length > 3 && (
            <Chip
              label={`+${post.amenities.length - 3}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {post.availableFrom && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Available from: {new Date(post.availableFrom).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
