import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authentication on component mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        toast.error('Please login to access dashboard');
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome, {user?.name}!
              </Typography>
              <Typography color="textSecondary">
                Email: {user?.email}
              </Typography>
              <Typography color="textSecondary">
                Role: {user?.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {user?.role === 'renter' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Renter Actions
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/properties/add')}
                  sx={{ mr: 2 }}
                >
                  Add Property
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/properties/manage')}
                >
                  Manage Properties
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {user?.role === 'user' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Actions
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/search')}
                  sx={{ mr: 2 }}
                >
                  Search Properties
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/bookings')}
                >
                  My Bookings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}