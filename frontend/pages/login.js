import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import Image from 'next/image';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/auth/login',
        formData
      );

      // Store token and user info
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Left side - Login Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Image
                  src="/logo.png"
                  alt="HRBD Logo"
                  width={150}
                  height={50}
                  priority
                />
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to continue to House Rent BD
                </Typography>
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Link href="/forgot-password" passHref>
                    <Typography
                      component="a"
                      variant="body2"
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                  <Link href="/register" passHref>
                    <Typography
                      component="a"
                      variant="body2"
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Don't have an account? Sign Up
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Right side - Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            height: '600px',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Image
              src="/login-illustration.jpg"
              alt="Login Illustration"
              layout="fill"
              objectFit="cover"
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
                Find Your Perfect Home
              </Typography>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Discover the best rental properties in Bangladesh
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
