import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box
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
import { motion } from 'framer-motion';

const settingsCards = [
  {
    title: 'Profile',
    description: 'Update your personal information and preferences',
    icon: <ProfileIcon sx={{ fontSize: 40 }} />,
    path: '/settings/profile',
    color: '#4CAF50'
  },
  {
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
    path: '/settings/notifications',
    color: '#2196F3'
  },
  {
    title: 'Security',
    description: 'Configure your security settings and password',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    path: '/settings/security',
    color: '#F44336'
  },
  {
    title: 'Privacy',
    description: 'Control your privacy settings and data sharing',
    icon: <PrivacyIcon sx={{ fontSize: 40 }} />,
    path: '/settings/privacy',
    color: '#9C27B0'
  },
  {
    title: 'Payment Methods',
    description: 'Manage your payment methods and billing',
    icon: <PaymentIcon sx={{ fontSize: 40 }} />,
    path: '/settings/payment',
    color: '#FF9800'
  },
  {
    title: 'Theme',
    description: 'Customize the appearance of your dashboard',
    icon: <ThemeIcon sx={{ fontSize: 40 }} />,
    path: '/settings/theme',
    color: '#795548'
  },
  {
    title: 'Language',
    description: 'Change your preferred language',
    icon: <LanguageIcon sx={{ fontSize: 40 }} />,
    path: '/settings/language',
    color: '#607D8B'
  }
];

const SettingsPage = () => {
  const router = useRouter();

  return (
    <SettingsLayout title="Settings">
      <Grid container spacing={3}>
        {settingsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardActionArea
                  onClick={() => router.push(card.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: `${card.color}20`,
                          color: card.color
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minHeight: 40 }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </SettingsLayout>
  );
};

export default SettingsPage;
