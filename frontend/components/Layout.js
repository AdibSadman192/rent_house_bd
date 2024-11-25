import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Bookmark,
  AddCircleOutline,
  Person,
  Login,
  Logout,
  Dashboard,
  Message,
  Settings,
  SupervisorAccount,
  ManageAccounts,
  Report,
  Apartment,
  People,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Define role-based menu items
const getRoleMenuItems = (role) => {
  const baseItems = [
    { name: 'View Profile', icon: <Person />, path: '/profile' },
    { name: 'Messages', icon: <Message />, path: '/messages' },
    { name: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const roleItems = {
    renter: [
      { name: 'My Rentals', icon: <Apartment />, path: '/my-rentals' },
      { name: 'Saved Posts', icon: <Bookmark />, path: '/saved-posts' },
    ],
    owner: [
      { name: 'My Properties', icon: <Apartment />, path: '/my-properties' },
      { name: 'Property Requests', icon: <People />, path: '/property-requests' },
    ],
    admin: [
      { name: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
      { name: 'Manage Users', icon: <ManageAccounts />, path: '/admin/users' },
      { name: 'Reports', icon: <Report />, path: '/admin/reports' },
    ],
    superadmin: [
      { name: 'Admin Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
      { name: 'Manage Admins', icon: <SupervisorAccount />, path: '/admin/manage' },
      { name: 'System Settings', icon: <Settings />, path: '/admin/settings' },
    ],
  };

  return [...baseItems, ...(roleItems[role] || [])];
};

// Define role-based navigation items
const getNavItems = (role) => {
  const baseItems = [
    { name: 'Home', path: '/', icon: <Home />, auth: false },
  ];

  const roleItems = {
    renter: [
      { name: 'Saved Posts', path: '/saved-posts', icon: <Bookmark />, auth: true },
    ],
    owner: [
      { name: 'Post Property', path: '/post-property', icon: <AddCircleOutline />, auth: true },
      { name: 'My Properties', path: '/my-properties', icon: <Apartment />, auth: true },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard />, auth: true },
    ],
    superadmin: [
      { name: 'Admin Panel', path: '/admin/dashboard', icon: <Dashboard />, auth: true },
    ],
  };

  return [...baseItems, ...(roleItems[role] || [])];
};

function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getAvatarColor = (role) => {
    const colors = {
      renter: '#4caf50',
      owner: '#2196f3',
      admin: '#f44336',
      superadmin: '#9c27b0'
    };
    return colors[role] || '#757575';
  };

  const menuItems = user ? getRoleMenuItems(user.role) : [];
  const navItems = user ? getNavItems(user.role) : getNavItems();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Rent House BD
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          (!item.auth || (item.auth && user)) && (
            <ListItem
              key={item.name}
              component={Link}
              href={item.path}
              passHref
              sx={{
                color: 'inherit',
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          )
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(100px)',
          WebkitBackdropFilter: 'blur(100px)',
          zIndex: 0,
        }
      }}
    >
      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 8, md: 9 },
          minHeight: '100vh',
        }}
      >
        <AppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                passHref
                sx={{
                  mr: 2,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  flexGrow: { xs: 1, md: 0 },
                }}
              >
                RENT HOUSE BD
              </Typography>

              {!isMobile && (
                <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                  {navItems.map((item) => (
                    (!item.auth || (item.auth && user)) && (
                      <Button
                        key={item.name}
                        component={Link}
                        href={item.path}
                        passHref
                        sx={{
                          my: 2,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          ...(router.pathname === item.path && {
                            backgroundColor: 'primary.dark',
                          }),
                        }}
                      >
                        {item.icon}
                        {item.name}
                      </Button>
                    )
                  ))}
                </Box>
              )}

              <Box sx={{ flexGrow: 0 }}>
                {user ? (
                  <>
                    <Tooltip title={`${user.name} (${user.role})`}>
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {user.avatar ? (
                          <Avatar 
                            alt={user.name} 
                            src={user.avatar}
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              bgcolor: getAvatarColor(user.role),
                              color: 'white',
                              width: 40,
                              height: 40
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {menuItems.map((item) => (
                        <MenuItem
                          key={item.name}
                          component={Link}
                          href={item.path}
                          passHref
                          onClick={handleCloseUserMenu}
                        >
                          <ListItemIcon>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText>{item.name}</ListItemText>
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem onClick={() => {
                        handleCloseUserMenu();
                        handleLogout();
                      }}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    component={Link}
                    href="/login"
                    passHref
                    color="inherit"
                    startIcon={<Login />}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>

        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright '}
            {new Date().getFullYear()}
            {' Rent House BD. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
