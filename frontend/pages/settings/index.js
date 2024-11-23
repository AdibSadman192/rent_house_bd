import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Grow
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Person as ProfileIcon,
  Visibility as PrivacyIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import SettingsLayout from '../../components/layout/SettingsLayout';

const SettingCard = ({ title, icon: Icon, path, description, color }) => {
  const router = useRouter();
  
  return (
    <Grow in={true} timeout={300}>
      <Card 
        sx={{
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardActionArea
          onClick={() => router.push(path)}
          sx={{ height: '100%', p: 2 }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: `${color}20`,
                  color: color
                }}
              >
                <Icon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6">{title}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grow>
  );
};

const settingsCards = [
  {
    title: 'Profile',
    description: 'Update your personal information and preferences',
    icon: ProfileIcon,
    path: '/settings/profile',
    color: '#4CAF50'
  },
  {
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: NotificationsIcon,
    path: '/settings/notifications',
    color: '#2196F3'
  },
  {
    title: 'Security',
    description: 'Configure your security settings and password',
    icon: SecurityIcon,
    path: '/settings/security',
    color: '#F44336'
  },
  {
    title: 'Privacy',
    description: 'Control your privacy settings and data sharing',
    icon: PrivacyIcon,
    path: '/settings/privacy',
    color: '#9C27B0'
  },
  {
    title: 'Payment Methods',
    description: 'Manage your payment methods and billing',
    icon: PaymentIcon,
    path: '/settings/payment',
    color: '#FF9800'
  },
  {
    title: 'Theme',
    description: 'Customize the appearance of your dashboard',
    icon: ThemeIcon,
    path: '/settings/theme',
    color: '#795548'
  },
  {
    title: 'Language',
    description: 'Change your preferred language',
    icon: LanguageIcon,
    path: '/settings/language',
    color: '#607D8B'
  }
];

const SettingsPage = () => {
  return (
    <SettingsLayout title="Settings">
      <Grid container spacing={3}>
        {settingsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.path}>
            <SettingCard {...card} />
          </Grid>
        ))}
      </Grid>
    </SettingsLayout>
  );
};

export default SettingsPage;
