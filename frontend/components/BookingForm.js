import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

const BookingForm = ({ propertyId, propertyPrice, onSuccess }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    startDate: Yup.date()
      .required('Start date is required')
      .min(new Date(), 'Start date cannot be in the past'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    moveInTime: Yup.string().required('Move-in time preference is required'),
    specialRequests: Yup.string(),
    parkingRequired: Yup.boolean(),
    movingCompanyName: Yup.string(),
    movingCompanyContact: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
      moveInTime: '',
      specialRequests: '',
      parkingRequired: false,
      movingCompanyName: '',
      movingCompanyContact: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.post('/api/bookings', {
          property: propertyId,
          startDate: values.startDate,
          endDate: values.endDate,
          moveInDetails: {
            preferredTime: values.moveInTime,
            specialRequests: values.specialRequests,
            parkingRequired: values.parkingRequired,
            movingCompany: {
              name: values.movingCompanyName,
              contact: values.movingCompanyContact
            }
          }
        });

        if (onSuccess) {
          onSuccess(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to create booking');
      } finally {
        setLoading(false);
      }
    }
  });

  const calculateTotalAmount = () => {
    if (!formik.values.startDate || !formik.values.endDate || !propertyPrice) {
      return 0;
    }

    const months = Math.ceil(
      (formik.values.endDate - formik.values.startDate) / (1000 * 60 * 60 * 24 * 30)
    );
    return months * propertyPrice;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Book Property
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue('startDate', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  fullWidth
                />
              )}
              minDate={new Date()}
            />

            <DatePicker
              label="End Date"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue('endDate', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  fullWidth
                />
              )}
              minDate={formik.values.startDate || new Date()}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Preferred Move-in Time</InputLabel>
            <Select
              name="moveInTime"
              value={formik.values.moveInTime}
              onChange={formik.handleChange}
              error={formik.touched.moveInTime && Boolean(formik.errors.moveInTime)}
            >
              <MenuItem value="morning">Morning (8 AM - 12 PM)</MenuItem>
              <MenuItem value="afternoon">Afternoon (12 PM - 4 PM)</MenuItem>
              <MenuItem value="evening">Evening (4 PM - 8 PM)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            name="specialRequests"
            label="Special Requests"
            value={formik.values.specialRequests}
            onChange={formik.handleChange}
            error={formik.touched.specialRequests && Boolean(formik.errors.specialRequests)}
            helperText={formik.touched.specialRequests && formik.errors.specialRequests}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="parkingRequired"
                checked={formik.values.parkingRequired}
                onChange={formik.handleChange}
              />
            }
            label="Parking Required for Moving Vehicle"
          />

          <TextField
            fullWidth
            name="movingCompanyName"
            label="Moving Company Name (Optional)"
            value={formik.values.movingCompanyName}
            onChange={formik.handleChange}
          />

          <TextField
            fullWidth
            name="movingCompanyContact"
            label="Moving Company Contact (Optional)"
            value={formik.values.movingCompanyContact}
            onChange={formik.handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Typography>
              Total Amount: ${calculateTotalAmount()}
              {propertyPrice && ` (${propertyPrice}/month)`}
            </Typography>
            <Typography>
              Security Deposit: ${propertyPrice} (One month's rent)
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default BookingForm;
