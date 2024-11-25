import React from 'react';
import {
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  Home,
  Person,
  Share,
  CalendarToday,
} from '@mui/icons-material';
import SavePostButton from './SavePostButton';
import GlassCard from './GlassCard';

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
    <GlassCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiCardMedia-root': {
          transition: 'transform 0.3s ease-in-out',
        },
        '&:hover .MuiCardMedia-root': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={post.images[0]}
          alt={post.propertyType}
          sx={{
            objectFit: 'cover',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 1,
            display: 'flex',
            gap: 1,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            borderBottomLeftRadius: '16px',
          }}
        >
          {showSaveButton && <SavePostButton postId={post._id} />}
          <Tooltip title="Share">
            <IconButton
              onClick={handleShare}
              sx={{
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {post.propertyType}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {post.area}, {post.city}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <AttachMoney color="action" sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#2196F3',
            }}
          >
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

        <Divider sx={{ my: 2, opacity: 0.2 }} />

        <Box display="flex" flexWrap="wrap" gap={1}>
          {post.amenities.slice(0, 3).map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            />
          ))}
          {post.amenities.length > 3 && (
            <Chip
              label={`+${post.amenities.length - 3}`}
              size="small"
              sx={{
                background: 'rgba(33, 150, 243, 0.1)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                color: '#2196F3',
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.2)',
                },
              }}
            />
          )}
        </Box>

        {post.availableFrom && (
          <Box display="flex" alignItems="center" mt={2}>
            <CalendarToday color="action" sx={{ mr: 1, fontSize: '0.9rem' }} />
            <Typography variant="body2" color="text.secondary">
              Available from: {new Date(post.availableFrom).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
}

export default PropertyCard;
