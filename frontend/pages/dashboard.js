import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Fade,
  Grow
} from '@mui/material';
import { FaHome, FaUser, FaChartBar, FaCog } from 'react-icons/fa';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PropertiesTab from '../components/dashboard/PropertiesTab';
import BookingsTab from '../components/dashboard/BookingsTab';
import SettingsTab from '../components/dashboard/SettingsTab';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axios';

// Loading Component
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

// Error Alert Component
const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ mb: 2 }}>
    <AlertTitle>Error</AlertTitle>
    {message}
  </Alert>
);

// Stats Card Component with animation
const StatsCard = ({ title, stat, icon: Icon, description }) => (
  <Grow in timeout={800}>
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {Icon && <Icon size={24} style={{ marginRight: '8px' }} />}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" gutterBottom>{stat}</Typography>
        <Typography variant="body2" color="textSecondary">{description}</Typography>
      </CardContent>
    </Card>
  </Grow>
);

// Main Dashboard Component
const Dashboard = ({ initialData, error: serverError }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [stats, setStats] = useState(initialData?.stats);
  const [error, setError] = useState(serverError);
  const [loading, setLoading] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Refresh stats
  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/dashboard/stats');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh dashboard stats');
      console.error('Error refreshing stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <ErrorAlert message={error} />
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Fade in timeout={500}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.firstName} {user?.lastName}
          </Typography>

          <Paper sx={{ width: '100%', mb: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Overview" />
              <Tab label="Properties" />
              <Tab label="Bookings" />
              <Tab label="Settings" />
            </Tabs>
          </Paper>

          <Box sx={{ mt: 4 }}>
            {tabIndex === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Properties"
                    stat={stats?.totalProperties || '0'}
                    icon={FaHome}
                    description="Active properties"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Users"
                    stat={stats?.totalUsers || '0'}
                    icon={FaUser}
                    description="Registered users"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Revenue"
                    stat={`$${stats?.revenue || '0'}`}
                    icon={FaChartBar}
                    description="Last 30 days"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Active Bookings"
                    stat={stats?.activeBookings || '0'}
                    icon={FaCog}
                    description="Current bookings"
                  />
                </Grid>
              </Grid>
            )}
            {tabIndex === 1 && <PropertiesTab />}
            {tabIndex === 2 && <BookingsTab />}
            {tabIndex === 3 && <SettingsTab />}
          </Box>
        </Container>
      </Fade>
    </DashboardLayout>
  );
};

// Server-side data fetching
export async function getServerSideProps({ req }) {
  try {
    // Get the auth token from the cookie
    const token = req.cookies.token;
    
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Fetch initial dashboard data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();

    return {
      props: {
        initialData: data,
      },
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return {
      props: {
        error: 'Failed to load dashboard data',
      },
    };
  }
}

export default Dashboard;