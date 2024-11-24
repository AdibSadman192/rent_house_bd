import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from '../../utils/axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Icon sx={{ color, mr: 1 }} />
        <Typography variant="h6" component="div" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DistributionCard = ({ title, data, colors }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box mt={2}>
        {Object.entries(data).map(([key, value], index) => (
          <Box key={key} mb={1}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" textTransform="capitalize">
                {key}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {value}
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 8,
                bgcolor: 'grey.100',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${(value / Object.values(data).reduce((a, b) => a + b, 0)) * 100}%`,
                  height: '100%',
                  bgcolor: colors[index],
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/users/stats');
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const roleColors = ['#2196f3', '#ff9800', '#f44336'];
  const statusColors = ['#4caf50', '#f44336'];

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        User Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={PersonIcon}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={CheckCircleIcon}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inactive Users"
            value={stats.totalUsers - stats.activeUsers}
            icon={BlockIcon}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users (30d)"
            value={stats.newUsers}
            icon={TrendingUpIcon}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DistributionCard
            title="Users by Role"
            data={stats.roleDistribution}
            colors={roleColors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DistributionCard
            title="Users by Status"
            data={stats.statusDistribution}
            colors={statusColors}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserStats;
