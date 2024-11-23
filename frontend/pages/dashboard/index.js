import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  Divider,
  LinearProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Apartment as ApartmentIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Simulate loading data
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isAuthenticated, router]);

  const stats = [
    {
      title: 'Saved Properties',
      value: '12',
      icon: <FavoriteIcon />,
      color: 'primary.main',
    },
    {
      title: 'Recent Views',
      value: '45',
      icon: <ApartmentIcon />,
      color: 'success.main',
    },
    {
      title: 'Messages',
      value: '8',
      icon: <MessageIcon />,
      color: 'info.main',
    },
    {
      title: 'Notifications',
      value: '3',
      icon: <NotificationsIcon />,
      color: 'warning.main',
    },
  ];

  const recentProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Gulshan',
      location: 'Gulshan, Dhaka',
      price: '৳35,000',
      type: 'Apartment',
      image: '/properties/apartment1.jpg',
    },
    {
      id: 2,
      title: 'Spacious House in Dhanmondi',
      location: 'Dhanmondi, Dhaka',
      price: '৳45,000',
      type: 'House',
      image: '/properties/house1.jpg',
    },
    {
      id: 3,
      title: 'Luxury Villa in Banani',
      location: 'Banani, Dhaka',
      price: '৳75,000',
      type: 'Villa',
      image: '/properties/villa1.jpg',
    },
  ];

  const renderStats = () => (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Zoom in={!loading} style={{ transitionDelay: `${index * 100}ms` }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  );

  const renderRecentProperties = () => (
    <Fade in={!loading} style={{ transitionDelay: '400ms' }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Recently Viewed Properties</Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/properties')}
            >
              View All
            </Button>
          </Box>
          <List>
            {recentProperties.map((property, index) => (
              <Box key={property.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    py: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => router.push(`/properties/${property.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={property.image}
                      alt={property.title}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={property.title}
                    secondary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {property.location}
                        </Typography>
                        <Chip
                          label={property.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {property.price}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton edge="end">
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderQuickSearch = () => (
    <Fade in={!loading} style={{ transitionDelay: '200ms' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Search
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              fullWidth
              onClick={() => router.push('/search')}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Search for properties...
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Popular Locations
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara'].map(
                (location) => (
                  <Chip
                    key={location}
                    label={location}
                    onClick={() =>
                      router.push(`/search?location=${location}`)
                    }
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  />
                )
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your rental journey.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          {renderStats()}
        </Grid>

        <Grid item xs={12} md={8}>
          {renderRecentProperties()}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderQuickSearch()}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;
