import { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useSession } from '@/hooks/useSession';
import { ROLES } from '@/config/roles';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  Switch,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Slider,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// Styled Components
const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 20,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  padding: '8px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
  },
}));

const Settings = () => {
  const { user } = useSession();
  const [settings, setSettings] = useState({
    maintenance: false,
    allowRegistration: true,
    maxPropertiesPerUser: 10,
    autoApproveListings: false,
    emailNotifications: true,
    chatEnabled: true,
    maxFileSize: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    currency: 'USD',
    language: 'en',
    timezone: 'UTC',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSliderChange = (name) => (event, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('/admin/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Failed to update settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const settingsGroups = [
    {
      title: 'General Settings',
      icon: <SettingsIcon />,
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Maintenance Mode</Typography>
              <Typography variant="body2" color="text.secondary">
                Enable maintenance mode to prevent user access
              </Typography>
            </Box>
            <Switch
              name="maintenance"
              checked={settings.maintenance}
              onChange={(e) => handleChange({ target: { name: 'maintenance', type: 'checkbox', checked: e.target.checked } })}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Allow Registration</Typography>
              <Typography variant="body2" color="text.secondary">
                Allow new users to register
              </Typography>
            </Box>
            <Switch
              name="allowRegistration"
              checked={settings.allowRegistration}
              onChange={(e) => handleChange({ target: { name: 'allowRegistration', type: 'checkbox', checked: e.target.checked } })}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Max Properties Per User
            </Typography>
            <Slider
              value={settings.maxPropertiesPerUser}
              onChange={handleSliderChange('maxPropertiesPerUser')}
              min={1}
              max={50}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      ),
    },
    {
      title: 'Feature Settings',
      icon: <HomeIcon />,
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Auto-approve Listings</Typography>
              <Typography variant="body2" color="text.secondary">
                Automatically approve new property listings
              </Typography>
            </Box>
            <Switch
              name="autoApproveListings"
              checked={settings.autoApproveListings}
              onChange={(e) => handleChange({ target: { name: 'autoApproveListings', type: 'checkbox', checked: e.target.checked } })}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Email Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Enable system-wide email notifications
              </Typography>
            </Box>
            <Switch
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange({ target: { name: 'emailNotifications', type: 'checkbox', checked: e.target.checked } })}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Chat System</Typography>
              <Typography variant="body2" color="text.secondary">
                Enable the chat system for users
              </Typography>
            </Box>
            <Switch
              name="chatEnabled"
              checked={settings.chatEnabled}
              onChange={(e) => handleChange({ target: { name: 'chatEnabled', type: 'checkbox', checked: e.target.checked } })}
            />
          </Box>
        </Box>
      ),
    },
    {
      title: 'Localization',
      icon: <LanguageIcon />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                label="Currency"
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="BDT">BDT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={settings.language}
                onChange={handleChange}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="bn">Bengali</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="Asia/Dhaka">Asia/Dhaka</MenuItem>
                <MenuItem value="America/New_York">America/New_York</MenuItem>
                <MenuItem value="Europe/London">Europe/London</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <GradientTypography variant="h4" gutterBottom>
              System Settings
            </GradientTypography>
            <Typography variant="body1" color="text.secondary">
              Manage system-wide configurations and preferences
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <AnimatePresence>
                {settingsGroups.map((group, index) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GlassCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ 
                          mr: 2,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          borderRadius: '50%',
                          p: 1,
                          color: 'white'
                        }}>
                          {group.icon}
                        </Box>
                        <GradientTypography variant="h6">
                          {group.title}
                        </GradientTypography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />
                      {group.content}
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <GradientButton
                  type="button"
                  startIcon={<RefreshIcon />}
                  onClick={() => window.location.reload()}
                  disabled={loading}
                >
                  Reset
                </GradientButton>
                <GradientButton
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </GradientButton>
              </Box>
            </Box>
          </form>
        </motion.div>
      </Box>
    </AdminLayout>
  );
};

// Add role-based access control
Settings.requireAuth = true;
Settings.requiredRole = ROLES.SUPER_ADMIN;

export default Settings;
