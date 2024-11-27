import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
  IconButton,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const MotionContainer = motion(Container);
const MotionCard = motion(Card);

const AdminDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, revenueRes, trendsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/recent-bookings'),
        axios.get('/api/admin/revenue-data'),
        axios.get('/api/admin/booking-trends'),
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
      setRevenueData(revenueRes.data);
      setBookingTrends(trendsRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: alpha(color, 0.1),
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            sx={{
              background: `linear-gradient(45deg, ${color}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" gutterBottom>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trend > 0 ? (
            <ArrowUpIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
          ) : (
            <ArrowDownIcon sx={{ color: theme.palette.error.main, mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : 'error.main'}
          >
            {Math.abs(trend)}% from last month
          </Typography>
        </Box>
      </CardContent>
    </MotionCard>
  );

  if (!user || user.role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        py: 4,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )}, ${alpha(theme.palette.background.default, 0.95)})`,
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Admin Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={fetchDashboardData}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && (
        <LinearProgress
          sx={{
            mb: 3,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Bookings"
                value={stats.totalBookings}
                icon={<CalendarIcon />}
                trend={stats.bookingTrend}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<PeopleIcon />}
                trend={stats.userTrend}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Properties"
                value={stats.totalProperties}
                icon={<HomeIcon />}
                trend={stats.propertyTrend}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={`$${stats.totalRevenue}`}
                icon={<MoneyIcon />}
                trend={stats.revenueTrend}
                color={theme.palette.info.main}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Revenue Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </MotionCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Bookings
                  </Typography>
                  <List>
                    {recentBookings.map((booking) => (
                      <ListItem
                        key={booking._id}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={booking.user.avatar}
                            sx={{
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            {booking.user.name[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={booking.user.name}
                          secondary={format(new Date(booking.date), 'MMM dd, yyyy')}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'medium',
                          }}
                        >
                          ${booking.amount}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Booking Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar
                        dataKey="bookings"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </MotionCard>
            </Grid>
          </Grid>
        )}
      </AnimatePresence>
    </MotionContainer>
  );
};

export default AdminDashboard;
