import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Menu,
  AppBar,
  IconButton,
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
  Avatar,
  Button,
  Tooltip,
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
  Article as ArticleIcon,
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  const handleLogout = async () => {
    try {
      handleCloseUserMenu();
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleNavigation = (path) => {
    handleCloseUserMenu();
    router.push(path);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, href: '/' },
    { text: 'Search', icon: <SearchIcon />, href: '/search' },
    { text: 'Properties', icon: <ApartmentIcon />, href: '/properties' },
    { text: 'Posts', icon: <ArticleIcon />, href: '/posts' },
  ];

  const userMenuItems = user ? [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => handleNavigation('/dashboard') },
    { text: 'Profile', icon: <PersonIcon />, onClick: () => handleNavigation('/profile') },
    { text: 'Settings', icon: <SettingsIcon />, onClick: () => handleNavigation('/settings') },
    user.role === 'renter' && { 
      text: 'Add Property', 
      icon: <ApartmentIcon />, 
      onClick: () => handleNavigation('/properties/add')
    },
    user.role === 'super_admin' && { 
      text: 'Admin Panel', 
      icon: <AdminIcon />, 
      onClick: () => handleNavigation('/admin')
    },
    { text: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
  ].filter(Boolean) : [
    { text: 'Login', icon: <LoginIcon />, onClick: () => handleNavigation('/login') },
    { text: 'Register', icon: <RegisterIcon />, onClick: () => handleNavigation('/register') }
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        transition: 'all 0.3s ease-in-out',
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isScrolled 
            ? 'none'
            : 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: -1,
          transition: 'all 0.3s ease-in-out',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
          <Link 
            href="/" 
            passHref
            style={{
              textDecoration: 'none'
            }}
          >
            <Box 
              component="a" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none !important',
                '&:hover': {
                  textDecoration: 'none !important'
                },
                '&:visited': {
                  textDecoration: 'none !important'
                },
                '&:active': {
                  textDecoration: 'none !important'
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isScrolled ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    letterSpacing: '0.5px'
                  }}
                >
                  HRBD
                </Typography>
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  ml: 1.5,
                  color: isScrolled ? 'text.primary' : 'white',
                  fontWeight: 600,
                  textDecoration: 'none !important',
                  textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease-in-out',
                  letterSpacing: '0.5px',
                  fontSize: '1.1rem',
                  '&:hover': {
                    color: isScrolled ? 'primary.main' : 'white',
                    textDecoration: 'none !important'
                  }
                }}
              >
                House Rent Bangladesh
              </Typography>
            </Box>
          </Link>

          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenUserMenu}
              sx={{
                color: isScrolled ? 'text.primary' : 'white',
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems.filter(Boolean).map((item) => (
                <Link key={item.text} href={item.href} passHref>
                  <Button
                    component="a"
                    startIcon={item.icon}
                    sx={{
                      color: isScrolled ? 'text.primary' : 'white',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                        color: isScrolled ? 'primary.main' : 'white',
                      },
                      textShadow: isScrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    {item.text}
                  </Button>
                </Link>
              ))}

              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Notifications">
                    <IconButton onClick={handleOpenNotifications} sx={{ color: isScrolled ? 'primary.main' : 'white' }}>
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu}>
                      <Avatar 
                        alt={user.name} 
                        src={user.avatar || '/avatar.png'}
                        sx={{ width: 32, height: 32 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    href="/login"
                    component={Link}
                    variant={isScrolled ? "outlined" : "text"}
                    startIcon={<LoginIcon />}
                    sx={{ color: isScrolled ? 'primary.main' : 'white' }}
                  >
                    Login
                  </Button>
                  <Button
                    href="/register"
                    component={Link}
                    variant={isScrolled ? "contained" : "outlined"}
                    startIcon={<RegisterIcon />}
                    sx={{ 
                      color: isScrolled ? 'white' : 'white',
                      borderColor: isScrolled ? 'primary.main' : 'white',
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          )}

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {userMenuItems.map((item) => (
              <MenuItem key={item.text} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          <Menu
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleCloseNotifications}>
              <ListItemText 
                primary="New Property Listed" 
                secondary="A new property was listed in your area"
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              <ListItemText 
                primary="Booking Request" 
                secondary="You have a new booking request"
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              <ListItemText 
                primary="Message Received" 
                secondary="You have a new message from a renter"
              />
            </MenuItem>
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;
