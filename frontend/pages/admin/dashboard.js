import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/theme';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PropertyMap from '@/components/PropertyMap';
import { debounce } from 'lodash';
import axios from '@/utils/axios';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserManagement from '@/components/admin/UserManagement';
import UserStats from '@/components/admin/UserStats';
import withAuth from '@/components/auth/withAuth';

const AdminDashboard = () => {
  const { user, checkPermission } = useAuth();
  const router = useRouter();
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      // toast.error('Failed to fetch dashboard data');
    }
  };

  // Fetch property analytics
  const fetchPropertyAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/admin/analytics/properties');
      setPropertyAnalytics(data);
    } catch (error) {
      console.error('Property analytics fetch error:', error);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/analytics/users');
      setUserStats(data);
    } catch (error) {
      console.error('User stats fetch error:', error);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchPropertyAnalytics(),
        fetchUserStats()
      ]);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      // toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle property approval
  const handlePropertyApproval = async (propertyId, approved) => {
    try {
      await axios.put(`/api/admin/properties/${propertyId}/approve`, { approved });
      // toast.success(`Property ${approved ? 'approved' : 'rejected'} successfully`);
      fetchAllData();
    } catch (error) {
      // toast.error('Failed to update property status');
    }
  };

  // Handle user actions
  const handleUserAction = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/${action}`);
      // toast.success('User status updated successfully');
      fetchAllData();
    } catch (error) {
      // toast.error('Failed to update user status');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardData?.stats?.totalUsers || 0,
      icon: <PersonIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Active Properties',
      value: dashboardData?.stats?.activeProperties || 0,
      icon: <HomeIcon />,
      color: theme.palette.success.main
    },
    {
      title: 'Pending Approvals',
      value: dashboardData?.stats?.pendingApprovals || 0,
      icon: <WarningIcon />,
      color: theme.palette.warning.main
    }
  ];

  // Render stats cards
  const renderStatsCards = () => (
    <Grid container spacing={3}>
      {statsCards.map((stat, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Render property approvals
  const renderPropertyApprovals = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dashboardData?.pendingProperties?.map((property) => (
            <TableRow key={property._id}>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.owner.name}</TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>
                <Chip 
                  label={property.status}
                  color={property.status === 'pending' ? 'warning' : 'success'}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  color="success"
                  onClick={() => handlePropertyApproval(property._id, true)}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handlePropertyApproval(property._id, false)}
                >
                  <CloseIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchAllData}
            variant="contained"
          >
            Refresh
          </Button>
        </Box>

        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Welcome back, {user?.name}!
            </Typography>
            <Divider sx={{ my: 3 }} />

            <Paper sx={{ width: '100%', mt: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="admin dashboard tabs"
              >
                <Tab
                  icon={<AssessmentIcon />}
                  iconPosition="start"
                  label="Overview"
                />
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label="User Management"
                />
                <Tab
                  icon={<HomeIcon />}
                  iconPosition="start"
                  label="Property Management"
                />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <UserStats />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <UserManagement />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" color="text.secondary" align="center">
                  Property Management Coming Soon
                </Typography>
              </TabPanel>
            </Paper>
          </Box>
        </Container>

        {renderStatsCards()}

        <Box mt={4}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Property Approvals" />
            <Tab label="User Management" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        <Box mt={2}>
          {tabValue === 0 && renderPropertyApprovals()}
          {tabValue === 1 && (
            <Typography variant="h6">User Management Coming Soon</Typography>
          )}
          {tabValue === 2 && (
            <Suspense fallback={<CircularProgress />}>
              <ChatbotAnalytics />
            </Suspense>
          )}
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'delete' ? 'Confirm Delete' : 'Confirm Action'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'delete' 
              ? 'Are you sure you want to delete this item?' 
              : 'Are you sure you want to perform this action?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            color={actionType === 'delete' ? 'error' : 'primary'}
            variant="contained"
            onClick={() => {
              // Handle confirmation action
              setDialogOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: 'admin' });
