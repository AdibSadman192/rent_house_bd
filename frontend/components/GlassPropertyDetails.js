import {
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  ImageList,
  ImageListItem,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  Hotel,
  AttachMoney,
  SquareFoot,
  Bathtub,
  KingBed,
  LocalParking,
  Security,
  Elevator,
  AcUnit,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import GlassButton from './GlassButton';

const DetailsContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 0,
  },

  '&:hover::before': {
    opacity: 1,
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),

  '& img': {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },

  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)',
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
  },

  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const GradientText = styled(Typography)(({ theme, color = 'primary' }) => ({
  background: `linear-gradient(45deg, ${theme.palette[color].main} 30%, ${theme.palette[color].light} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const GlassPropertyDetails = ({ property, onFavorite, onShare, onContact }) => {
  const {
    title,
    description,
    price,
    location,
    images,
    features,
    amenities,
    isFavorite,
    specifications,
  } = property;

  const amenityIcons = {
    'Air Conditioning': <AcUnit />,
    'Parking': <LocalParking />,
    'Security': <Security />,
    'Elevator': <Elevator />,
  };

  return (
    <DetailsContainer>
      <ImageContainer>
        <ImageList variant="quilted" cols={4} rowHeight={200} gap={8}>
          {images.slice(0, 4).map((image, index) => (
            <ImageListItem key={index} cols={index === 0 ? 2 : 1} rows={index === 0 ? 2 : 1}>
              <img src={image} alt={`Property ${index + 1}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            onClick={onFavorite}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(5px)',
              '&:hover': { background: 'rgba(255, 255, 255, 1)' },
            }}
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            onClick={onShare}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(5px)',
              '&:hover': { background: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <Share />
          </IconButton>
        </Box>
      </ImageContainer>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <GradientText variant="h4" gutterBottom>
              {title}
            </GradientText>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                {location}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              {specifications.map(({ icon: Icon, label, value }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Icon sx={{ mb: 1, fontSize: '2rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Features & Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {amenities.map((amenity) => (
                <FeatureChip
                  key={amenity}
                  icon={amenityIcons[amenity]}
                  label={amenity}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: 'sticky',
              top: 24,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              p: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <GradientText variant="h4" gutterBottom>
              ৳{price.toLocaleString()}
              <Typography
                component="span"
                variant="subtitle1"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                /month
              </Typography>
            </GradientText>

            <Box sx={{ mt: 3 }}>
              <GlassButton
                fullWidth
                variant="contained"
                size="large"
                onClick={onContact}
                sx={{ mb: 2 }}
              >
                Contact Owner
              </GlassButton>
              <GlassButton
                fullWidth
                variant="outlined"
                size="large"
                onClick={onShare}
              >
                Share Property
              </GlassButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DetailsContainer>
  );
};

export default GlassPropertyDetails;
