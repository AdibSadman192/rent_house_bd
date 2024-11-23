import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Sms as SmsIcon,
  VolumeUp as VolumeUpIcon,
  NotificationsActive as NotificationsActiveIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNotification } from '../../contexts/NotificationContext';
import SettingsLayout from '../../components/layout/SettingsLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const theme = useTheme();
  const { preferences, updatePreferences, loading } = useNotification();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setLocalPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePreferences(localPreferences);
      setHasChanges(false);
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = () => {
    toast.info('This is a test notification', {
      icon: <NotificationsActiveIcon />,
    });
    if (localPreferences.sound) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play();
    }
  };

  if (loading) {
    return (
      <SettingsLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Notification Settings
          </Typography>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Channels
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.email}
                      onChange={handleChange}
                      name="email"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" />
                      <Typography>Email Notifications</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.push}
                      onChange={handleChange}
                      name="push"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotificationsIcon color="action" />
                      <Typography>Push Notifications</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.sms}
                      onChange={handleChange}
                      name="sms"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmsIcon color="action" />
                      <Typography>SMS Notifications</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.sound}
                      onChange={handleChange}
                      name="sound"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VolumeUpIcon color="action" />
                      <Typography>Sound Notifications</Typography>
                    </Box>
                  }
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Types
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Choose which types of notifications you want to receive
              </Alert>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.bookings}
                      onChange={handleChange}
                      name="bookings"
                      color="primary"
                    />
                  }
                  label="Booking Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.messages}
                      onChange={handleChange}
                      name="messages"
                      color="primary"
                    />
                  }
                  label="New Messages"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.propertyUpdates}
                      onChange={handleChange}
                      name="propertyUpdates"
                      color="primary"
                    />
                  }
                  label="Property Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences.marketing}
                      onChange={handleChange}
                      name="marketing"
                      color="primary"
                    />
                  }
                  label="Marketing & Promotions"
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              mt: 3
            }}
          >
            <Button
              variant="outlined"
              onClick={handleTestNotification}
              startIcon={<NotificationsActiveIcon />}
            >
              Test Notification
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </SettingsLayout>
  );
};

export default NotificationSettings;
