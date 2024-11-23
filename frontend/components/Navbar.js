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
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: scrolled ? 'background.paper' : 'transparent',
        transition: 'all 0.3s',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? 1 : 0,
        borderColor: 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: -1,
          transition: 'all 0.3s',
        },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                mr: 2,
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
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="HRBD Logo"
                  width={30}
                  height={30}
                  priority
                />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: scrolled ? 'primary.main' : 'common.white',
                  textDecoration: 'none',
                  display: { xs: 'none', md: 'flex' },
                  textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Rent House BD
              </Typography>
            </Box>
          </Link>

          {/* Navigation Items */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Link href="/" passHref>
                <Button
                  startIcon={<HomeIcon />}
                  sx={{
                    color: scrolled ? 'text.primary' : 'common.white',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: scrolled ? 'action.hover' : 'rgba(255, 255, 255, 0.1)',
                    },
                    textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  Home
                </Button>
              </Link>
              <Link href="/search" passHref>
                <Button
                  startIcon={<SearchIcon />}
                  sx={{
                    color: scrolled ? 'text.primary' : 'common.white',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: scrolled ? 'action.hover' : 'rgba(255, 255, 255, 0.1)',
                    },
                    textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  Search
                </Button>
              </Link>
              <Link href="/properties" passHref>
                <Button
                  startIcon={<ApartmentIcon />}
                  sx={{
                    color: scrolled ? 'text.primary' : 'common.white',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: scrolled ? 'action.hover' : 'rgba(255, 255, 255, 0.1)',
                    },
                    textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  Properties
                </Button>
              </Link>
            </Box>
          )}

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Fade in={true} style={{ transitionDelay: '200ms' }}>
                  <Box>
                    <Tooltip title="Notifications">
                      <IconButton
                        onClick={handleOpenNotifications}
                        sx={{
                          color: scrolled ? 'text.primary' : 'common.white',
                          '&:hover': {
                            backgroundColor: scrolled ? 'action.hover' : 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <Badge badgeContent={3} color="error">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorElNotifications}
                      open={Boolean(anchorElNotifications)}
                      onClose={handleCloseNotifications}
                      onClick={handleCloseNotifications}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          width: 320,
                          maxHeight: 400,
                          overflowY: 'auto',
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem>
                        <ListItemText
                          primary="New Booking Request"
                          secondary="John Doe wants to book your property"
                        />
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <ListItemText
                          primary="Property Approved"
                          secondary="Your listing has been approved"
                        />
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <ListItemText
                          primary="Message Received"
                          secondary="You have a new message from Jane Smith"
                        />
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
                <Fade in={true} style={{ transitionDelay: '250ms' }}>
                  <Box>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu}>
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
                      anchorEl={anchorElUser}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      onClick={handleCloseUserMenu}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 200,
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Link href="/dashboard" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem>
                          <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText>Dashboard</ListItemText>
                        </MenuItem>
                      </Link>
                      <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem>
                          <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText>Profile</ListItemText>
                        </MenuItem>
                      </Link>
                      <Link href="/settings" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem>
                          <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            <SettingsIcon />
                          </ListItemIcon>
                          <ListItemText>Settings</ListItemText>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2, color: 'error.main' }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Fade in={true} style={{ transitionDelay: '250ms' }}>
                  <Link href="/login" passHref>
                    <Button
                      startIcon={<LoginIcon />}
                      variant="outlined"
                      sx={{
                        borderColor: scrolled ? 'primary.main' : 'common.white',
                        color: scrolled ? 'primary.main' : 'common.white',
                        '&:hover': {
                          borderColor: scrolled ? 'primary.dark' : 'common.white',
                          backgroundColor: scrolled ? 'action.hover' : 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                </Fade>
                <Fade in={true} style={{ transitionDelay: '300ms' }}>
                  <Link href="/register" passHref>
                    <Button
                      startIcon={<RegisterIcon />}
                      variant="contained"
                      sx={{
                        bgcolor: scrolled ? 'primary.main' : 'common.white',
                        color: scrolled ? 'common.white' : 'primary.main',
                        '&:hover': {
                          bgcolor: scrolled ? 'primary.dark' : 'common.white',
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Link>
                </Fade>
              </Box>
            )}
          </Box>

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton
              size="large"
              aria-label="menu"
              onClick={() => {/* Add mobile menu handler */}}
              sx={{
                color: scrolled ? 'text.primary' : 'common.white',
                ml: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
