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
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', formData);
      
      if (response.data.success) {
        const userData = response.data.data;
        // Store token and user info
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
          id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          isVerified: userData.isVerified
        }));

        toast.success('Successfully logged in!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Welcome Back!
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                        <EmailIcon />
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
                        <LockIcon />
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
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/register" passHref>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                        {"Don't have an account? Sign Up"}
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Right side - Illustration */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
              <Image
                src="https://cdni.iconscout.com/illustration/premium/thumb/login-page-4468581-3783954.png"
                alt="Login illustration"
                layout="fill"
                objectFit="contain"
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
