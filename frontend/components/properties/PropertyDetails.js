import { Box, Typography, Chip, Divider } from '@mui/material';
import { BedOutlined, BathtubOutlined, SquareFootOutlined, LocationOn } from '@mui/icons-material';
import Image from 'next/image';

const PropertyDetails = ({ property }) => {
  return (
    <Box>
      <Box sx={{ position: 'relative', height: 400, mb: 4 }}>
        <Image
          src={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {property.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationOn color="action" sx={{ mr: 1 }} />
        <Typography color="text.secondary">
          {property.location.address}
        </Typography>
      </Box>

      <Typography variant="h5" color="primary" gutterBottom>
        ৳{property.price?.toLocaleString()} / month
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip label={property.propertyType} color="primary" variant="outlined" />
        <Chip label={property.status} color="secondary" variant="outlined" />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BedOutlined sx={{ mr: 1 }} />
          <Typography>{property.bedrooms} Beds</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BathtubOutlined sx={{ mr: 1 }} />
          <Typography>{property.bathrooms} Baths</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SquareFootOutlined sx={{ mr: 1 }} />
          <Typography>{property.size} sqft</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Description
      </Typography>
      <Typography paragraph>
        {property.description}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Amenities
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {property.amenities?.map((amenity) => (
          <Chip key={amenity} label={amenity} variant="outlined" />
        ))}
      </Box>
    </Box>
  );
};

export default PropertyDetails;
