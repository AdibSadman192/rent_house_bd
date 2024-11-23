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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nid: '',
    address: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'nid', 'address'];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    // Name length validation
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      toast.error('First name must be between 2 and 50 characters');
      return false;
    }
    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      toast.error('Last name must be between 2 and 50 characters');
      return false;
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return false;
    }

    // Phone validation (Bangladesh format)
    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid Bangladesh phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post('/auth/register', registerData);
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Create an Account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Join our community and start exploring rental properties
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801XXXXXXXXX"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="NID Number"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="user">Regular User</MenuItem>
                  <MenuItem value="renter">Property Owner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 4, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" passHref style={{ color: 'primary.main' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
