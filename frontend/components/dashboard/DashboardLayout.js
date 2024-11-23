import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Apartment as ApartmentIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  SupervisorAccount as AdminIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';

const DRAWER_WIDTH = 280;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSubMenuToggle = (key) => {
    setSubMenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getMenuItems = () => {
    const items = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        href: `/${user?.role}/dashboard`,
        show: true,
      },
      {
        text: 'Profile',
        icon: <PersonIcon />,
        href: '/profile',
        show: true,
      },
      {
        text: 'Properties',
        icon: <ApartmentIcon />,
        href: '/properties',
        show: true,
        subItems: [
          { text: 'All Properties', href: '/properties' },
          { text: 'Add Property', href: '/properties/add' },
          { text: 'My Properties', href: '/properties/my-properties' },
        ],
      },
      {
        text: 'Messages',
        icon: <MessageIcon />,
        href: '/messages',
        show: true,
        badge: 3,
      },
      {
        text: 'User Management',
        icon: <PeopleIcon />,
        href: '/admin/users',
        show: hasPermission('admin'),
        subItems: [
          { text: 'All Users', href: '/admin/users' },
          { text: 'Roles & Permissions', href: '/admin/roles' },
        ],
      },
      {
        text: 'System Settings',
        icon: <SecurityIcon />,
        href: '/super-admin/settings',
        show: hasPermission('super-admin'),
        subItems: [
          { text: 'General Settings', href: '/super-admin/settings' },
          { text: 'Security', href: '/super-admin/security' },
          { text: 'Backup', href: '/super-admin/backup' },
        ],
      },
      {
        text: 'Analytics',
        icon: <AnalyticsIcon />,
        href: '/analytics',
        show: hasPermission('admin'),
      },
      {
        text: 'Settings',
        icon: <SettingsIcon />,
        href: '/settings',
        show: true,
      },
    ].filter((item) => item.show);

    return items;
  };

  const renderMenuItem = (item, index) => {
    const isSelected = router.pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <Box key={item.text}>
        <ListItem disablePadding>
          <ListItemButton
            component={hasSubItems ? 'div' : Link}
            href={hasSubItems ? undefined : item.href}
            selected={isSelected}
            onClick={hasSubItems ? () => handleSubMenuToggle(item.text) : undefined}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: isSelected ? 'primary.main' : 'inherit',
              }}
            >
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {hasSubItems && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubMenuToggle(item.text);
                }}
              >
                {subMenuOpen[item.text] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
        {hasSubItems && (
          <Collapse in={subMenuOpen[item.text]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => (
                <ListItemButton
                  key={subItem.text}
                  component={Link}
                  href={subItem.href}
                  selected={router.pathname === subItem.href}
                  sx={{
                    pl: 6,
                    '&.Mui-selected': {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemText
                    primary={subItem.text}
                    primaryTypographyProps={{
                      variant: 'body2',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: open ? `${DRAWER_WIDTH}px` : 0 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {user?.role === 'super-admin'
                ? 'Super Admin Dashboard'
                : user?.role === 'admin'
                ? 'Admin Dashboard'
                : user?.role === 'renter'
                ? 'Renter Dashboard'
                : 'User Dashboard'}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
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
          <Typography variant="h6" noWrap component="div">
            HRBD
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List>{getMenuItems().map(renderMenuItem)}</List>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} HRBD
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
