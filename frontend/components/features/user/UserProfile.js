import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put('/api/users/profile', formData);
      updateUser(data.data);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      setLoading(true);
      const { data } = await axios.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      updateUser(data.data);
      setUploadDialogOpen(false);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  if (!user) return null;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Box position="relative">
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 120, height: 120 }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper'
              }}
              onClick={() => setUploadDialogOpen(true)}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Box>
          <Box ml={3}>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              disabled={editMode}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Bio"
                fullWidth
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </Grid>
            {editMode && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        bio: user.bio || ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload Profile Picture</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
              >
                Choose Photo
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" mt={1}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUploadAvatar}
            variant="contained"
            disabled={!selectedFile || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
