import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Fade,
  Zoom,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
      });
    }
  }, [user, isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
    });
    setEditMode(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Profile Settings
        </Typography>
      </Zoom>

      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      mx: 'auto',
                      border: '4px solid',
                      borderColor: 'primary.main',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </Avatar>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  >
                    <input hidden accept="image/*" type="file" />
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member since
                  </Typography>
                  <Typography variant="body1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Right Column - Edit Form */}
        <Grid item xs={12} md={8}>
          <Fade in={true} style={{ transitionDelay: '300ms' }}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {!editMode ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    color="primary"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editMode}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => router.push('/change-password')}
              >
                Change Password
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => router.push('/delete-account')}
              >
                Delete Account
              </Button>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
