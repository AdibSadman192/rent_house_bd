import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Fade,
  Zoom,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import {
  Person as PersonIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { adminAPI, analyticsAPI, propertyAPI } from '../../lib/api';

// Dynamic imports for better performance
const ChatbotAnalytics = dynamic(() => import('../../components/ChatbotAnalytics'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});

const PropertyMap = dynamic(() => import('../../components/PropertyMap'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});

const LoadingPlaceholder = () => (
  <Box display="flex" justifyContent="center" alignItems="center" p={4}>
    <CircularProgress />
  </Box>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [propertyAnalytics, setPropertyAnalytics] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [systemStats, setSystemStats] = useState(null);

  // Fetch all dashboard data
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        dashboardResponse,
        propertyAnalyticsResponse,
        userStatsResponse,
        systemStatsResponse
      ] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getPropertyAnalytics(),
        analyticsAPI.getUserStats(),
        adminAPI.getSystemStats()
      ]);

      setDashboardData(dashboardResponse.data);
      setPropertyAnalytics(propertyAnalyticsResponse.data);
      setUserStats(userStatsResponse.data);
      setSystemStats(systemStatsResponse.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to fetch dashboard data. Please try again.');
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced refresh function
  const debouncedRefresh = useMemo(
    () => debounce(() => {
      setRefreshKey(prev => prev + 1);
      fetchAllData();
    }, 1000),
    [fetchAllData]
  );

  // Initial data fetch and refresh setup
  useEffect(() => {
    fetchAllData();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(debouncedRefresh, 300000); // Refresh every 5 minutes
    
    return () => {
      debouncedRefresh.cancel();
      clearInterval(refreshInterval);
    };
  }, [fetchAllData, debouncedRefresh, refreshKey]);

  // Admin role check
  useEffect(() => {
    if (typeof window !== 'undefined' && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    debouncedRefresh();
  };

  // Memoized stats data
  const stats = useMemo(() => [
    {
      title: 'Total Users',
      value: dashboardData?.stats?.users || '0',
      icon: <PersonIcon />,
      change: dashboardData?.stats?.userGrowth || '+0%',
      positive: (dashboardData?.stats?.userGrowth || '0').startsWith('+'),
    },
    {
      title: 'Active Properties',
      value: dashboardData?.stats?.properties || '0',
      icon: <HomeIcon />,
      change: dashboardData?.stats?.propertyGrowth || '+0%',
      positive: (dashboardData?.stats?.propertyGrowth || '0').startsWith('+'),
    },
    {
      title: 'Monthly Bookings',
      value: dashboardData?.stats?.bookings || '0',
      icon: <CalendarIcon />,
      change: dashboardData?.stats?.bookingGrowth || '+0%',
      positive: (dashboardData?.stats?.bookingGrowth || '0').startsWith('+'),
    },
  ], [dashboardData]);

  const recentUsers = useMemo(() => [
    { id: 1, name: 'Rahul Ahmed', email: 'rahul@example.com', role: 'Renter', status: 'Active' },
    { id: 2, name: 'Priya Das', email: 'priya@example.com', role: 'User', status: 'Pending' },
    { id: 3, name: 'Kamal Khan', email: 'kamal@example.com', role: 'Renter', status: 'Active' },
  ], []);

  const recentProperties = useMemo(() => [
    { id: 1, title: 'Luxury Apartment', location: 'Gulshan', owner: 'Ahmed Ali', status: 'Active' },
    { id: 2, title: 'Family House', location: 'Dhanmondi', owner: 'Sara Khan', status: 'Pending' },
    { id: 3, title: 'Studio Apartment', location: 'Banani', owner: 'Rahim Mia', status: 'Active' },
  ], []);

  const renderOverview = () => (
    <Box>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Zoom in={!loading} style={{ transitionDelay: `${index * 100}ms` }}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h6">{stat.title}</Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {stat.positive ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
                    <Typography
                      variant="body2"
                      color={stat.positive ? "success.main" : "error.main"}
                      sx={{ ml: 1 }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Users</Typography>
              <List>
                {recentUsers.map((user) => (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <Chip
                        label={user.status}
                        color={user.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{user.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email} • ${user.role}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Properties</Typography>
              <List>
                {recentProperties.map((property) => (
                  <ListItem
                    key={property.id}
                    secondaryAction={
                      <Chip
                        label={property.status}
                        color={property.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar><HomeIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={property.title}
                      secondary={`${property.location} • ${property.owner}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderUsersTable = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Users Management</Typography>
        <Button variant="contained" startIcon={<PersonIcon />}>
          Add User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'Active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderPropertiesTable = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Properties Management</Typography>
        <Button variant="contained" startIcon={<HomeIcon />}>
          Add Property
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}><HomeIcon /></Avatar>
                    {property.title}
                  </Box>
                </TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>{property.owner}</TableCell>
                <TableCell>
                  <Chip
                    label={property.status}
                    color={property.status === 'Active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <AnimatePresence>
          {loading ? (
            <LinearProgress />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                            {stat.icon}
                          </Avatar>
                          <Typography variant="h6">{stat.title}</Typography>
                        </Box>
                        <Typography variant="h4" component="div">
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {stat.positive ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
                          <Typography
                            variant="body2"
                            color={stat.positive ? "success.main" : "error.main"}
                            sx={{ ml: 1 }}
                          >
                            {stat.change}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons="auto"
                >
                  <Tab label="Analytics" />
                  <Tab label="Properties" />
                  <Tab label="Users" />
                  <Tab label="Reports" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    {tabValue === 0 && <ChatbotAnalytics />}
                    {tabValue === 1 && <PropertyMap />}
                    {tabValue === 2 && renderUsersTable()}
                    {tabValue === 3 && renderPropertiesTable()}
                  </Suspense>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </DashboardLayout>
  );
};

export default AdminDashboard;
