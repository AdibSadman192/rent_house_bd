import { useState, useEffect } from 'react';
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
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  Badge,
  Zoom,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Apartment as ApartmentIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  SupervisorAccount as AdminIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, logout, hasPermission } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      handleCloseUserMenu();
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleBasedDashboardLink = () => {
    if (hasPermission('super-admin')) return '/super-admin/dashboard';
    if (hasPermission('admin')) return '/admin/dashboard';
    if (hasPermission('renter')) return '/renter/dashboard';
    return '/dashboard';
  };

  const navigationItems = [
    { text: 'Home', href: '/', icon: <HomeIcon /> },
    { text: 'Search', href: '/search', icon: <SearchIcon /> },
    { text: 'Properties', href: '/properties', icon: <ApartmentIcon /> },
  ];

  const userMenuItems = user ? [
    { 
      text: 'Profile', 
      href: '/profile', 
      icon: <PersonIcon />,
      show: true 
    },
    { 
      text: 'Dashboard', 
      href: getRoleBasedDashboardLink(),
      icon: <DashboardIcon />,
      show: true 
    },
    { 
      text: 'Admin Panel', 
      href: '/admin/dashboard',
      icon: <AdminIcon />,
      show: hasPermission('admin')
    },
    { 
      text: 'Super Admin', 
      href: '/super-admin/dashboard',
      icon: <SecurityIcon />,
      show: hasPermission('super-admin')
    },
    { 
      text: 'Messages', 
      href: '/messages',
      icon: <ChatIcon />,
      show: true
    },
    { 
      text: 'Settings', 
      href: '/settings',
      icon: <SettingsIcon />,
      show: true
    }
  ].filter(item => item.show) : [
    { text: 'Login', href: '/login', icon: <LoginIcon /> },
    { text: 'Register', href: '/register', icon: <RegisterIcon /> }
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Image
          src="/logo.svg"
          alt="HRBD Logo"
          width={40}
          height={40}
          priority
        />
        <Typography variant="h6" component="div">
          HRBD
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            href={item.href}
            onClick={handleMobileMenuToggle}
            selected={router.pathname === item.href}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        {userMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            href={item.href}
            onClick={handleMobileMenuToggle}
            selected={router.pathname === item.href}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {user && (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={scrolled ? 4 : 1}
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'background.default',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: theme.transitions.create(['background-color', 'box-shadow', 'backdrop-filter'], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Image
                src="/logo.svg"
                alt="HRBD Logo"
                width={40}
                height={40}
                priority
              />
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  letterSpacing: '.1rem',
                }}
              >
                HRBD
              </Typography>
            </Box>
          </Zoom>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navigationItems.map((item, index) => (
                <Fade in={true} style={{ transitionDelay: `${150 + index * 50}ms` }} key={item.text}>
                  <Button
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    sx={{
                      mx: 1,
                      color: router.pathname === item.href ? 'primary.main' : 'text.primary',
                      borderBottom: router.pathname === item.href ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                        borderBottom: 2,
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                </Fade>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {/* User Menu (Desktop) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Fade in={true} style={{ transitionDelay: '250ms' }}>
                    <IconButton
                      onClick={handleOpenNotifications}
                      size="large"
                      color="inherit"
                    >
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Fade>
                  <Menu
                    anchorEl={anchorElNotifications}
                    open={Boolean(anchorElNotifications)}
                    onClose={handleCloseNotifications}
                    sx={{ mt: 2 }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem>
                      <Typography variant="body2">New message from John</Typography>
                    </MenuItem>
                    <MenuItem>
                      <Typography variant="body2">Property request approved</Typography>
                    </MenuItem>
                    <MenuItem>
                      <Typography variant="body2">System update completed</Typography>
                    </MenuItem>
                  </Menu>
                  
                  <Fade in={true} style={{ transitionDelay: '300ms' }}>
                    <Box>
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleOpenUserMenu}
                          sx={{
                            p: 0,
                            border: '2px solid transparent',
                            transition: 'all 0.2s',
                            '&:hover': {
                              border: '2px solid',
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <Avatar
                            alt={user.name}
                            src={user.avatar}
                            sx={{
                              bgcolor: 'primary.main',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {user.name ? user.name[0].toUpperCase() : 'U'}
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
                        <Box sx={{ px: 2, py: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                        <Divider />
                        {userMenuItems.map((item) => (
                          <MenuItem
                            key={item.text}
                            component={Link}
                            href={item.href}
                            onClick={handleCloseUserMenu}
                            sx={{
                              gap: 1,
                              transition: 'all 0.2s',
                              '&:hover': {
                                color: 'primary.main',
                                '& .MuiListItemIcon-root': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          >
                            <ListItemIcon 
                              sx={{ 
                                minWidth: 'auto',
                                transition: 'all 0.2s',
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <Typography>{item.text}</Typography>
                          </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem 
                          onClick={handleLogout}
                          sx={{
                            gap: 1,
                            color: 'error.main',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'error.lighter',
                              '& .MuiListItemIcon-root': {
                                color: 'error.main',
                              },
                            },
                          }}
                        >
                          <ListItemIcon 
                            sx={{ 
                              minWidth: 'auto',
                              color: 'error.main',
                            }}
                          >
                            <LogoutIcon />
                          </ListItemIcon>
                          <Typography>Logout</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Fade>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Fade in={true} style={{ transitionDelay: '250ms' }}>
                    <Button
                      component={Link}
                      href="/login"
                      startIcon={<LoginIcon />}
                      variant="outlined"
                      sx={{
                        borderRadius: '20px',
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Fade>
                  <Fade in={true} style={{ transitionDelay: '300ms' }}>
                    <Button
                      component={Link}
                      href="/register"
                      startIcon={<RegisterIcon />}
                      variant="contained"
                      sx={{
                        borderRadius: '20px',
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Fade>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileMenuToggle}
              color="inherit"
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      {renderMobileMenu()}
    </AppBar>
  );
};

export default Navbar;
