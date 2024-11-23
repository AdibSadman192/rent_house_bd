import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhoneAndroid as PhoneIcon,
  Email as EmailIcon,
  Key as KeyIcon,
  History as HistoryIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import SettingsLayout from '../../components/layout/SettingsLayout';
import { toast } from 'react-toastify';

const SecuritySettings = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    requirePasswordChange: false
  });
  const [recentActivity] = useState([
    {
      action: 'Login',
      device: 'Chrome on Windows',
      location: 'Dhaka, Bangladesh',
      time: '2 hours ago',
      status: 'success'
    },
    {
      action: 'Password Change',
      device: 'Mobile App',
      location: 'Dhaka, Bangladesh',
      time: '2 days ago',
      status: 'success'
    },
    {
      action: 'Failed Login Attempt',
      device: 'Firefox on Mac',
      location: 'Unknown Location',
      time: '5 days ago',
      status: 'failed'
    }
  ]);

  useEffect(() => {
    // Simulate fetching security settings
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingChange = (setting) => (event) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      setSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password updated successfully!');
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySettingsSubmit = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Security settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update security settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsLayout title="Security Settings">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Security Settings">
      <Fade in={true} timeout={500}>
        <Grid container spacing={3}>
          {/* Password Section */}
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
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <KeyIcon color="primary" />
                    <Typography variant="h6">
                      Password
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    It's a good idea to use a strong password that you're not using elsewhere
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenPasswordDialog(true)}
                    startIcon={<LockIcon />}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Two-Factor Authentication */}
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
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PhoneIcon color="primary" />
                    <Typography variant="h6">
                      Two-Factor Authentication
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onChange={handleSettingChange('twoFactorEnabled')}
                        color="primary"
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Add an extra layer of security to your account by requiring both your password and phone.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Security Notifications */}
          <Grid item xs={12}>
            <Grow in={true} timeout={300}>
              <Card 
                elevation={0}
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <EmailIcon color="primary" />
                    <Typography variant="h6">
                      Security Notifications
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.emailNotifications}
                            onChange={handleSettingChange('emailNotifications')}
                            color="primary"
                          />
                        }
                        label="Email notifications for suspicious activity"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.loginAlerts}
                            onChange={handleSettingChange('loginAlerts')}
                            color="primary"
                          />
                        }
                        label="Login alerts for unrecognized devices"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.requirePasswordChange}
                            onChange={handleSettingChange('requirePasswordChange')}
                            color="primary"
                          />
                        }
                        label="Require password change every 3 months"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Grow in={true} timeout={300}>
              <Card 
                elevation={0}
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6">
                      Recent Activity
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  {recentActivity.map((activity, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: activity.status === 'failed' ? 'error.lighter' : 'background.paper'
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">
                            {activity.action}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2">
                            {activity.device}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2">
                            {activity.location}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSecuritySettingsSubmit}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <SecurityIcon />}
              >
                {saving ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog 
          open={openPasswordDialog} 
          onClose={() => !saving && setOpenPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handlePasswordSubmit}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <Box py={1}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setOpenPasswordDialog(false)} 
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Fade>
    </SettingsLayout>
  );
};

export default SecuritySettings;
