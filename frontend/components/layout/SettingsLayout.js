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
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Person as ProfileIcon,
  Payment as PaymentIcon,
  DeleteForever as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const settingsMenuItems = [
  { 
    title: 'Profile', 
    icon: ProfileIcon, 
    path: '/settings/profile/',
    description: 'Manage your personal information'
  },
  { 
    title: 'Security', 
    icon: SecurityIcon, 
    path: '/settings/security/',
    description: 'Update your security settings'
  },
  { 
    title: 'Notifications', 
    icon: NotificationsIcon, 
    path: '/settings/notifications/',
    description: 'Configure your notification preferences'
  },
  { 
    title: 'Theme', 
    icon: ThemeIcon, 
    path: '/settings/theme/',
    description: 'Customize your visual experience'
  },
  { 
    title: 'Language', 
    icon: LanguageIcon, 
    path: '/settings/language/',
    description: 'Change your language settings'
  },
  { 
    title: 'Delete Account', 
    icon: DeleteIcon, 
    path: '/settings/delete-account/',
    description: 'Permanently delete your account'
  }
];

const SettingsLayout = ({ children, title = 'Settings' }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentPath = router.pathname;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                height: '100%'
              }}
            >
              <List component="nav">
                {settingsMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    passHref
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemButton
                      selected={currentPath === item.path.slice(0, -1)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: theme.palette.primary.light + '20',
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            bgcolor: theme.palette.primary.light + '30',
                          }
                        },
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        }
                      }}
                    >
                      <ListItemIcon>
                        <item.icon color={currentPath === item.path.slice(0, -1) ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          color: currentPath === item.path.slice(0, -1) ? 'primary' : 'inherit'
                        }}
                      />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SettingsLayout;
