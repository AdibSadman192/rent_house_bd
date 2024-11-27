import React, { useState } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useScrollTrigger,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Building2,
  PlusSquare,
  UserPlus,
  LogIn,
  LayoutDashboard,
} from 'lucide-react';
import { useRouter } from 'next/router';

const GlassAppBar = styled(AppBar)(({ theme, elevated }) => ({
  background: elevated 
    ? 'rgba(255, 255, 255, 0.85)'
    : 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: elevated 
    ? '0 8px 32px -4px rgba(0, 0, 0, 0.05)'
    : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
    pointerEvents: 'none',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 600 : 500,
  fontSize: '0.95rem',
  padding: '10px 20px',
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(59, 15, 107, 0.12) 0%, rgba(79, 28, 137, 0.12) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    '&::before': {
      opacity: 1,
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '& svg': {
    width: 20,
    height: 20,
    transition: 'transform 0.2s ease',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  },
  ...(active && {
    backgroundColor: 'rgba(59, 15, 107, 0.08)',
    '&::before': {
      opacity: 1,
    },
  }),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b0f6b 0%, #4f1c89 100%)',
  color: 'white',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(59, 15, 107, 0.25)',
    '&::before': {
      opacity: 1,
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 4px 12px rgba(59, 15, 107, 0.2)',
  },
  '& svg': {
    width: 20,
    height: 20,
    transition: 'transform 0.2s ease',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.5rem',
  background: 'linear-gradient(135deg, #3b0f6b 0%, #4f1c89 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.3s ease',
  '& svg': {
    width: 28,
    height: 28,
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-1px)',
    '& svg': {
      transform: 'scale(1.1) rotate(-5deg)',
    },
  },
}));

const pages = [
  { name: 'Home', href: '/', icon: <Home /> },
  { name: 'Properties', href: '/properties', icon: <Building2 /> },
  { name: 'Post Property', href: '/post-property', icon: <PlusSquare /> },
];

const authPages = [
  { name: 'Sign Up', href: '/signup', icon: <UserPlus />, gradient: true },
  { name: 'Login', href: '/login', icon: <LogIn /> },
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <GlassAppBar 
      position="sticky" 
      elevation={0}
      elevated={trigger}
      sx={{
        py: 1.5,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 } }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Logo>
              <Building2 />
              Rent House BD
            </Logo>
          </Link>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              sx={{
                color: 'text.primary',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(59, 15, 107, 0.08)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                elevation: 0,
                sx: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  mt: 1.5,
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #3b0f6b, #4f1c89)',
                  },
                  '& .MuiMenuItem-root': {
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    gap: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 15, 107, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {[...pages, ...authPages].map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MenuItem 
                    onClick={handleCloseNavMenu}
                    selected={router.pathname === page.href}
                  >
                    {page.icon}
                    <Typography 
                      sx={{ 
                        fontWeight: router.pathname === page.href ? 600 : 400,
                        color: router.pathname === page.href ? 'primary.main' : 'inherit',
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, ml: 4 }}>
            {pages.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                passHref
                style={{ textDecoration: 'none' }}
              >
                <NavButton active={router.pathname === page.href}>
                  {page.icon}
                  {page.name}
                </NavButton>
              </Link>
            ))}
          </Box>

          {/* Auth Buttons - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {authPages.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                passHref
                style={{ textDecoration: 'none' }}
              >
                {page.gradient ? (
                  <GradientButton>
                    {page.icon}
                    {page.name}
                  </GradientButton>
                ) : (
                  <NavButton active={router.pathname === page.href}>
                    {page.icon}
                    {page.name}
                  </NavButton>
                )}
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </GlassAppBar>
  );
}

export default Navbar;
