import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Paper,
  useTheme,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import SettingsLayout from '../../components/layout/SettingsLayout';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    occupation: '',
    website: ''
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setFormData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+880 1234567890',
        address: '123 Main Street',
        city: 'Dhaka',
        country: 'Bangladesh',
        bio: 'Experienced real estate professional with a passion for helping people find their dream homes.',
        occupation: 'Real Estate Agent',
        website: 'www.johndoe.com'
      });
      setPreviewImage('/default-avatar.png');
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsLayout title="Profile Settings">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Profile Settings">
      <Fade in={true} timeout={500}>
        <Grid container spacing={3}>
          {/* Profile Image Section */}
          <Grid item xs={12}>
            <Grow in={true} timeout={300}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1
                }}
              >
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  gap={3}
                >
                  <Box position="relative">
                    <Avatar
                      src={previewImage}
                      sx={{
                        width: 120,
                        height: 120,
                        border: `4px solid ${theme.palette.background.paper}`,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    {editMode && (
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <PhotoCameraIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h5" gutterBottom>
                      {formData.firstName} {formData.lastName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {formData.occupation}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formData.city}, {formData.country}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                      onClick={() => setEditMode(!editMode)}
                      color={editMode ? 'error' : 'primary'}
                      variant="outlined"
                    >
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grow>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={300}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={300}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Bio Section */}
          <Grid item xs={12}>
            <Grow in={true} timeout={300}>
              <Card 
                elevation={0}
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bio
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Tell us about yourself"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Save Button */}
          {editMode && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Fade>
    </SettingsLayout>
  );
};

export default ProfileSettings;
