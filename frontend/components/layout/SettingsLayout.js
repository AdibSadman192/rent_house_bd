import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Grid,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Person as ProfileIcon,
  Visibility as PrivacyIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from './DashboardLayout';

const settingsMenu = [
  {
    title: 'Profile',
    icon: <ProfileIcon />,
    path: '/settings/profile'
  },
  {
    title: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/settings/notifications'
  },
  {
    title: 'Security',
    icon: <SecurityIcon />,
    path: '/settings/security'
  },
  {
    title: 'Privacy',
    icon: <PrivacyIcon />,
    path: '/settings/privacy'
  },
  {
    title: 'Payment Methods',
    icon: <PaymentIcon />,
    path: '/settings/payment'
  },
  {
    title: 'Theme',
    icon: <ThemeIcon />,
    path: '/settings/theme'
  },
  {
    title: 'Language',
    icon: <LanguageIcon />,
    path: '/settings/language'
  }
];

const SettingsLayout = ({ children, title = 'Settings' }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const renderSettingsMenu = () => (
    <List component="nav">
      {settingsMenu.map(({ title, icon, path }) => (
        <ListItem key={path} disablePadding>
          <ListItemButton
            component={Link}
            href={path}
            selected={router.pathname === path}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <DashboardLayout title={title}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div">
                    <SettingsIcon
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                    />
                    Settings
                  </Typography>
                </Box>
                <Divider />
                {renderSettingsMenu()}
              </Paper>
            </Grid>
          )}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                minHeight: '500px'
              }}
            >
              {isMobile && (
                <>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" component="div">
                      {title}
                    </Typography>
                  </Box>
                  <Divider />
                </>
              )}
              <Box sx={{ p: 3 }}>
                {children}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SettingsLayout;
