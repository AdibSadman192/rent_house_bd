import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import axios from '../../utils/axios';

const PropertyDashboard = ({ propertyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [neighborhoodData, setNeighborhoodData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchNeighborhoodInfo();
  }, [propertyId, fetchAnalytics, fetchNeighborhoodInfo]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/properties/${propertyId}/analytics`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const fetchNeighborhoodInfo = async () => {
    try {
      const response = await axios.get(`/api/properties/${propertyId}/neighborhood`);
      setNeighborhoodData(response.data);
    } catch (error) {
      console.error('Error fetching neighborhood info:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Property Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Property Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Performance Metrics</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Views: {analytics?.views || 0}</Typography>
                <Typography>Inquiries: {analytics?.inquiries || 0}</Typography>
                <Typography>Bookings: {analytics?.bookings || 0}</Typography>
                <Typography>Average Rating: {analytics?.averageRating || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Visitor Demographics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Visitor Demographics</Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <BarChart
                  width={600}
                  height={250}
                  data={analytics?.demographics || []}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Neighborhood Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Neighborhood Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Safety Score</Typography>
                <Typography variant="h4">{neighborhoodData?.safetyScore}/10</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Transit Score</Typography>
                <Typography variant="h4">{neighborhoodData?.transitScore}/10</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Walkability Score</Typography>
                <Typography variant="h4">{neighborhoodData?.walkabilityScore}/10</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" gutterBottom>
              Nearby Amenities
            </Typography>
            <Grid container spacing={2}>
              {neighborhoodData?.amenities?.map((amenity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Typography>
                    {amenity.type}: {amenity.distance}km
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Historical Price Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Price Trends</Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <LineChart
                  width={900}
                  height={250}
                  data={analytics?.priceTrends || []}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                  <Line type="monotone" dataKey="marketAverage" stroke="#82ca9d" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyDashboard;