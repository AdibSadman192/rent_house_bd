import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Home,
  AttachMoney,
  LocationOn,
  Category
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function SavedPostStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/saved-posts/stats', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" p={3}>
        {error}
      </Typography>
    );
  }

  if (!stats) {
    return (
      <Typography align="center" p={3}>
        No statistics available
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Total Saved */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Home color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Saved</Typography>
            </Box>
            <Typography variant="h4">{stats.totalSaved}</Typography>
          </Paper>
        </Grid>

        {/* Price Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Price Range</Typography>
            </Box>
            <Typography variant="body1">
              Min: {stats.minPrice.toLocaleString()} BDT
            </Typography>
            <Typography variant="body1">
              Avg: {stats.avgPrice.toLocaleString()} BDT
            </Typography>
            <Typography variant="body1">
              Max: {stats.maxPrice.toLocaleString()} BDT
            </Typography>
          </Paper>
        </Grid>

        {/* Property Types */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Category color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Property Types</Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {stats.propertyTypes.map(type => (
                <Chip
                  key={type}
                  label={type}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Areas */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Areas</Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {stats.areas.map(area => (
                <Chip
                  key={area}
                  label={area}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SavedPostStats;
