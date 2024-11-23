import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
  useTheme,
  Fade,
  Grow
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
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

const NotificationSettings = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/api/user/notification-settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/api/user/notification-settings', settings);
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <SettingsLayout title="Notification Settings">
      <Fade in timeout={500}>
        <Box>
          <Grow in timeout={800}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notification Preferences
                </Typography>
                <Divider sx={{ my: 2 }} />
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={handleChange}
                            name="emailNotifications"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ mr: 1 }} />
                            <Typography>Email Notifications</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.smsNotifications}
                            onChange={handleChange}
                            name="smsNotifications"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SmsIcon sx={{ mr: 1 }} />
                            <Typography>SMS Notifications</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={handleChange}
                            name="pushNotifications"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsActiveIcon sx={{ mr: 1 }} />
                            <Typography>Push Notifications</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.soundNotifications}
                            onChange={handleChange}
                            name="soundNotifications"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VolumeUpIcon sx={{ mr: 1 }} />
                            <Typography>Sound Notifications</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.marketingEmails}
                            onChange={handleChange}
                            name="marketingEmails"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ mr: 1 }} />
                            <Typography>Marketing Emails</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Box>
      </Fade>
    </SettingsLayout>
  );
};

export default NotificationSettings;
