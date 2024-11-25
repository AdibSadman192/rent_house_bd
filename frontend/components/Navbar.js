import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Search,
  Add as AddIcon,
  Favorite,
  Person,
  Settings,
  Logout,
  ChevronRight,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import GlassButton from './GlassButton';
import { GlassMenu, GlassMenuItem } from './GlassMenu';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.01)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: 'none',
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  right: 0,
  margin: 0,
  padding: 0,
  zIndex: 1200,
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
  },

  '& .MuiToolbar-root': {
    height: '64px',
    minHeight: '64px !important',
    padding: '0 24px',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'transparent',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRight: 'none',
    width: 280,
    padding: theme.spacing(2),
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      zIndex: -1,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '1px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
    },
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: -1,
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
    transition: 'all 0.3s ease-in-out',
    transform: 'translateX(-50%)',
  },

  '&:hover': {
    color: theme.palette.primary.main,

    '&::before': {
      opacity: 1,
    },

    '&::after': {
      width: '80%',
    },
  },
}));

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, href: '/' },
    { text: 'Search', icon: <Search />, href: '/search' },
    { text: 'Add Property', icon: <AddIcon />, href: '/add-property' },
    { text: 'Favorites', icon: <Favorite />, href: '/favorites' },
  ];

  const drawer = (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Rent House BD
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.href}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <GlassAppBar elevation={0}>
        <Toolbar disableGutters>
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Rent House BD
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
              {menuItems.map((item) => (
                <NavLink key={item.text} href={item.href}>
                  {item.text}
                </NavLink>
              ))}
            </Box>
          )}

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              </IconButton>
              <GlassMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                  <Avatar
                    src={user.photoURL}
                    alt={user.displayName}
                    sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <GlassMenuItem component={Link} href="/profile">
                  <Person /> Profile
                </GlassMenuItem>
                <GlassMenuItem component={Link} href="/settings">
                  <Settings /> Settings
                </GlassMenuItem>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <GlassMenuItem onClick={handleLogout} className="danger">
                  <Logout /> Logout
                </GlassMenuItem>
              </GlassMenu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <GlassButton
                component={Link}
                href="/login"
                variant="outlined"
                size="small"
              >
                Login
              </GlassButton>
              <GlassButton
                component={Link}
                href="/register"
                variant="contained"
                size="small"
              >
                Register
              </GlassButton>
            </Box>
          )}
        </Toolbar>
      </GlassAppBar>

      {isMobile && (
        <StyledDrawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          {drawer}
        </StyledDrawer>
      )}
    </>
  );
}
