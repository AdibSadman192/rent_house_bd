import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Payment as PaymentIcon,
  Star as ReviewIcon,
  Build as ToolsIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'Properties',
    icon: <HomeIcon />,
    path: '/properties'
  },
  {
    title: 'Profile',
    icon: <PersonIcon />,
    path: '/profile'
  },
  {
    title: 'Messages',
    icon: <MessageIcon />,
    path: '/messages'
  },
  {
    title: 'Bookings',
    icon: <BookmarkIcon />,
    path: '/bookings'
  },
  {
    title: 'Analytics',
    icon: <AssessmentIcon />,
    path: '/analytics'
  },
  {
    title: 'Payments',
    icon: <PaymentIcon />,
    path: '/payments'
  },
  {
    title: 'Reviews',
    icon: <ReviewIcon />,
    path: '/reviews'
  },
  {
    title: 'Tools',
    icon: <ToolsIcon />,
    path: '/tools'
  }
];

const settingsItems = [
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings'
  }
];

const Sidebar = () => {
  const router = useRouter();

  const renderNavItem = ({ title, icon, path }) => (
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
  );

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          House Rental
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map(renderNavItem)}
      </List>
      <Divider />
      <List>
        {settingsItems.map(renderNavItem)}
      </List>
    </Box>
  );
};

export default Sidebar;
