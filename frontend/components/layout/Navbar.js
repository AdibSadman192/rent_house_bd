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
  styled,
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
import { motion } from 'framer-motion';

// Styled Components
const NavbarContainer = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '95%',
  maxWidth: '1400px',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  borderRadius: '50px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(1, 2),
  zIndex: theme.zIndex.appBar,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF4081 100%)',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(255, 64, 129, 0.3)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textDecoration: 'none',
  fontSize: '1.5rem',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '8px',
  margin: '4px 0',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.primary.main,
  },
}));

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
    <NavbarContainer elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/" passHref>
            <LogoText
              component="a"
              sx={{
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <HomeIcon sx={{ fontSize: '1.8rem' }} />
              RENT HOUSE BD
            </LogoText>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleMenuClick(item.path)}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <IconButton
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <StyledBadge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </StyledBadge>
                </IconButton>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tooltip title={user ? `${user.name} (${user.role})` : 'Account'}>
                <IconButton 
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.5,
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '14px',
                    '&:hover': {
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                    },
                  }}
                >
                  <Avatar
                    alt={user?.name || 'Guest'}
                    src={user?.avatar}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: user ? 'primary.main' : 'grey.500',
                      background: user 
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                        : undefined,
                    }}
                  >
                    {user?.name?.charAt(0) || 'G'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  minWidth: 220,
                },
              }}
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
              {userMenuItems.map((item, index) => (
                <StyledMenuItem
                  key={item.label}
                  onClick={item.onClick || (() => handleMenuClick(item.path))}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <Typography>{item.label}</Typography>
                </StyledMenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </NavbarContainer>

    {/* Mobile Drawer */}
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
      }}
    >
      <Box sx={{ mb: 4, px: 2 }}>
        <LogoText sx={{ fontSize: '1.8rem' }}>
          <HomeIcon sx={{ fontSize: '2rem', mr: 1 }} />
          RENT HOUSE BD
        </LogoText>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ px: 1 }}>
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem
              button
              onClick={() => handleMenuClick(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ px: 1 }}>
        {userMenuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: (index + navigationItems.length) * 0.1 }}
          >
            <ListItem
              button
              onClick={item.onClick || (() => handleMenuClick(item.path))}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Drawer>
  </>;
};

export default Navbar;
