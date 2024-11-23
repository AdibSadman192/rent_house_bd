import { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AvatarUpload = ({ size = 150, editable = true }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (editable && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update user context with new avatar
      updateUser({
        ...user,
        avatar: response.data.data.avatar,
      });

      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(
        error.response?.data?.message || 'Error uploading avatar'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user.avatar) return;

    try {
      setLoading(true);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/avatar`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update user context to remove avatar
      updateUser({
        ...user,
        avatar: null,
      });

      toast.success('Avatar removed successfully');
    } catch (error) {
      console.error('Avatar deletion error:', error);
      toast.error(
        error.response?.data?.message || 'Error removing avatar'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          editable && (
            <Tooltip title={user.avatar ? 'Change avatar' : 'Upload avatar'}>
              <IconButton
                onClick={handleAvatarClick}
                disabled={loading}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        }
      >
        <Avatar
          src={user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}` : undefined}
          alt={user.name}
          sx={{
            width: size,
            height: size,
            cursor: editable ? 'pointer' : 'default',
            fontSize: size * 0.4,
          }}
          onClick={handleAvatarClick}
        >
          {user.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      {loading && (
        <CircularProgress
          size={size * 0.8}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: `-${size * 0.4}px`,
            marginLeft: `-${size * 0.4}px`,
          }}
        />
      )}

      {editable && user.avatar && !loading && (
        <Tooltip title="Remove avatar">
          <IconButton
            onClick={handleDeleteAvatar}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: -8,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default AvatarUpload;
