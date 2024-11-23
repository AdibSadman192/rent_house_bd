import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const SettingsTab = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: {
      email: user?.notifications?.email || false,
      push: user?.notifications?.push || false,
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch('/api/users/profile', formData);
      updateUser(response.data.data);
      toast.success('Settings updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.email}
                  onChange={handleNotificationChange}
                  name="email"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange}
                  name="push"
                />
              }
              label="Push Notifications"
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Change Password</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/settings/change-password')}
          >
            Update Password
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography>Delete Account</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => router.push('/settings/delete-account')}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsTab;
