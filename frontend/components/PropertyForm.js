import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ImageUpload from './ImageUpload';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Condo'];
const AMENITIES = [
  'Air Conditioning',
  'Heating',
  'Wifi',
  'Kitchen',
  'TV',
  'Parking',
  'Elevator',
  'Security System'
];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  propertyType: Yup.string().required('Property type is required'),
  address: Yup.object({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZIP code is required'),
    country: Yup.string().required('Country is required')
  }),
  features: Yup.object({
    bedrooms: Yup.number().required('Number of bedrooms is required'),
    bathrooms: Yup.number().required('Number of bathrooms is required'),
    size: Yup.number().required('Property size is required'),
    furnished: Yup.boolean(),
    parking: Yup.boolean()
  }),
  amenities: Yup.array().min(1, 'Select at least one amenity'),
  availableFrom: Yup.date().required('Available date is required'),
  minimumLeasePeriod: Yup.number()
    .required('Minimum lease period is required')
    .positive('Must be positive')
});

const PropertyForm = ({ initialValues, onSubmit, loading }) => {
  const [images, setImages] = useState([]);

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      price: '',
      propertyType: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      features: {
        bedrooms: '',
        bathrooms: '',
        size: '',
        furnished: false,
        parking: false
      },
      amenities: [],
      availableFrom: '',
      minimumLeasePeriod: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit({ ...values, images });
    }
  });

  const handleImageUpload = async (formData, onProgress) => {
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
      
      // In a real application, you would make an API call here
      const response = await fetch('/api/properties/images', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setImages(prev => [...prev, ...data.images]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      // In a real application, you would make an API call here
      await fetch(`/api/properties/images/${imageId}`, {
        method: 'DELETE'
      });
      
      setImages(prev => prev.filter(img => img._id !== imageId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="propertyType"
              value={formik.values.propertyType}
              onChange={formik.handleChange}
              error={formik.touched.propertyType && Boolean(formik.errors.propertyType)}
            >
              {PROPERTY_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="address.street"
            label="Street"
            value={formik.values.address.street}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.street && Boolean(formik.errors.address?.street)
            }
            helperText={formik.touched.address?.street && formik.errors.address?.street}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="address.city"
            label="City"
            value={formik.values.address.city}
            onChange={formik.handleChange}
            error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
            helperText={formik.touched.address?.city && formik.errors.address?.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="address.state"
            label="State"
            value={formik.values.address.state}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.state && Boolean(formik.errors.address?.state)
            }
            helperText={formik.touched.address?.state && formik.errors.address?.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="address.zipCode"
            label="ZIP Code"
            value={formik.values.address.zipCode}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.zipCode &&
              Boolean(formik.errors.address?.zipCode)
            }
            helperText={
              formik.touched.address?.zipCode && formik.errors.address?.zipCode
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="address.country"
            label="Country"
            value={formik.values.address.country}
            onChange={formik.handleChange}
            error={
              formik.touched.address?.country &&
              Boolean(formik.errors.address?.country)
            }
            helperText={
              formik.touched.address?.country && formik.errors.address?.country
            }
          />
        </Grid>

        {/* Features */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="features.bedrooms"
            label="Bedrooms"
            type="number"
            value={formik.values.features.bedrooms}
            onChange={formik.handleChange}
            error={
              formik.touched.features?.bedrooms &&
              Boolean(formik.errors.features?.bedrooms)
            }
            helperText={
              formik.touched.features?.bedrooms && formik.errors.features?.bedrooms
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="features.bathrooms"
            label="Bathrooms"
            type="number"
            value={formik.values.features.bathrooms}
            onChange={formik.handleChange}
            error={
              formik.touched.features?.bathrooms &&
              Boolean(formik.errors.features?.bathrooms)
            }
            helperText={
              formik.touched.features?.bathrooms && formik.errors.features?.bathrooms
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="features.size"
            label="Size (sq ft)"
            type="number"
            value={formik.values.features.size}
            onChange={formik.handleChange}
            error={
              formik.touched.features?.size && Boolean(formik.errors.features?.size)
            }
            helperText={formik.touched.features?.size && formik.errors.features?.size}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                name="features.furnished"
                checked={formik.values.features.furnished}
                onChange={formik.handleChange}
              />
            }
            label="Furnished"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="features.parking"
                checked={formik.values.features.parking}
                onChange={formik.handleChange}
              />
            }
            label="Parking"
          />
        </Grid>

        {/* Amenities */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Amenities
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Amenities</InputLabel>
            <Select
              multiple
              name="amenities"
              value={formik.values.amenities}
              onChange={formik.handleChange}
              input={<OutlinedInput label="Amenities" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {AMENITIES.map((amenity) => (
                <MenuItem key={amenity} value={amenity}>
                  {amenity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Availability */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Availability
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="availableFrom"
            label="Available From"
            type="date"
            value={formik.values.availableFrom}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true
            }}
            error={
              formik.touched.availableFrom && Boolean(formik.errors.availableFrom)
            }
            helperText={formik.touched.availableFrom && formik.errors.availableFrom}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="minimumLeasePeriod"
            label="Minimum Lease Period (months)"
            type="number"
            value={formik.values.minimumLeasePeriod}
            onChange={formik.handleChange}
            error={
              formik.touched.minimumLeasePeriod &&
              Boolean(formik.errors.minimumLeasePeriod)
            }
            helperText={
              formik.touched.minimumLeasePeriod && formik.errors.minimumLeasePeriod
            }
          />
        </Grid>

        {/* Images */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Property Images
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ImageUpload
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
            existingImages={images}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Saving...' : 'Save Property'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PropertyForm;
