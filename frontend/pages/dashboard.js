import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
} from '@mui/material';
import {
  Home,
  Bookmark,
  Message,
  Notifications,
  Settings,
  ChevronRight,
  Payment,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../components/auth/withAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const menuItems = [
  { icon: <Home />, text: 'Properties', count: 12 },
  { icon: <Bookmark />, text: 'Saved', count: 5 },
  { icon: <Message />, text: 'Messages', count: 3 },
  { icon: <Payment />, text: 'Payments', count: 2 },
  { icon: <Star />, text: 'Reviews', count: 8 },
  { icon: <Settings />, text: 'Settings' },
];

function Dashboard() {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: '100vh',
        background: 'var(--primary-color)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              className="glass"
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid var(--accent-color)',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'var(--glass-border)' }} />

              <List>
                {menuItems.map((item, index) => (
                  <ListItemButton
                    key={item.text}
                    selected={selectedItem === index}
                    onClick={() => setSelectedItem(index)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'var(--glass-bg-hover)',
                        '&:hover': {
                          backgroundColor: 'var(--glass-bg-hover)',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'var(--glass-bg-hover)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'var(--accent-color)' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          color: 'var(--text-primary)',
                        },
                      }}
                    />
                    {item.count && (
                      <Badge
                        badgeContent={item.count}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: 'var(--accent-color)',
                          },
                        }}
                      />
                    )}
                    <ChevronRight sx={{ color: 'var(--text-secondary)' }} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              {[
                { title: 'Total Views', value: '2.4K', icon: <Notifications /> },
                { title: 'Properties', value: '12', icon: <Home /> },
                { title: 'Messages', value: '28', icon: <Message /> },
                { title: 'Bookmarks', value: '5', icon: <Bookmark /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} key={stat.title}>
                  <Paper
                    component={motion.div}
                    variants={itemVariants}
                    className="glass"
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '24px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--text-secondary)' }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{
                        backgroundColor: 'var(--glass-bg-hover)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'var(--glass-bg-hover)',
                        },
                      }}
                    >
                      {stat.icon}
                    </IconButton>
                  </Paper>
                </Grid>
              ))}

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Paper
                  component={motion.div}
                  variants={itemVariants}
                  className="glass"
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Recent Activity
                  </Typography>
                  <List>
                    {[
                      'New message from John Doe',
                      'Property view request',
                      'Payment received',
                      'New review posted',
                    ].map((activity, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'var(--glass-bg-hover)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={activity}
                          secondary="2 hours ago"
                          sx={{
                            '& .MuiTypography-root': {
                              color: 'var(--text-primary)',
                            },
                            '& .MuiTypography-body2': {
                              color: 'var(--text-secondary)',
                            },
                          }}
                        />
                        <ChevronRight sx={{ color: 'var(--text-secondary)' }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default withAuth(Dashboard);