import React, { useState, useEffect } from 'react';
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
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Apartment as ApartmentIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    handleCloseNavMenu();
    router.push(path);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      { label: 'Home', path: '/', icon: <HomeIcon /> },
      { label: 'Search', path: '/search', icon: <SearchIcon /> },
      { label: 'Properties', path: '/properties', icon: <ApartmentIcon /> },
    ];

    if (user) {
      if (user.role === 'renter') {
        items.push({
          label: 'Add Property',
          path: '/properties/add',
          icon: <AddIcon />,
        });
      }
      if (['admin', 'super-admin'].includes(user.role)) {
        items.push({
          label: 'Admin',
          path: '/admin/dashboard',
          icon: <AdminIcon />,
        });
      }
    }

    return items;
  };

  // User menu items based on role
  const getUserMenuItems = () => {
    if (!user) {
      return [
        { label: 'Login', path: '/login', icon: <PersonIcon /> },
        { label: 'Register', path: '/register', icon: <AddIcon /> },
      ];
    }

    const items = [
      { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
      { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    ];

    if (user.role === 'super-admin') {
      items.push({
        label: 'Admin Panel',
        path: '/admin/dashboard',
        icon: <AdminIcon />,
      });
    }

    items.push({
      label: 'Logout',
      onClick: async () => {
        await handleLogout();
        handleCloseUserMenu();
      },
      icon: <LogoutIcon />,
    });

    return items;
  };

  const navigationItems = getNavigationItems();
  const userMenuItems = getUserMenuItems();

  const drawer = (
    <Box onClick={handleDrawerToggle}>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleMenuClick(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userMenuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={item.onClick || (() => handleMenuClick(item.path))}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
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

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              RENT HOUSE BD
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => handleMenuClick(item.path)}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              {user && (
                <IconButton
                  sx={{ mr: 2 }}
                  color="inherit"
                >
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}
              <Tooltip title={user ? `${user.name} (${user.role})` : 'Account'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || 'Guest'}
                    src={user?.avatar}
                    sx={{
                      bgcolor: user ? theme.palette.primary.main : 'grey.500',
                    }}
                  >
                    {user?.name?.charAt(0) || 'G'}
                  </Avatar>
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
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={item.onClick || (() => handleMenuClick(item.path))}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
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
    </>
  );
};

export default Navbar;
