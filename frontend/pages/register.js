import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  Email,
  Lock,
  Phone,
  Badge,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      delay: 0.2,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  tap: { scale: 0.98 },
};

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nid: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await register(formData);
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (name, label, type = 'text', icon, props = {}) => (
    <TextField
      fullWidth
      required
      name={name}
      label={label}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      value={formData[name]}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ),
        ...(type === 'password' && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: 'var(--text-secondary)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }),
        ...props,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--text-primary)',
          '& fieldset': {
            borderColor: 'var(--glass-border)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--accent-color)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--accent-color)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--text-secondary)',
          '&.Mui-focused': {
            color: 'var(--accent-color)',
          },
        },
      }}
    />
  );

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
        py: 12,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/pattern.svg")',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          component={motion.div}
          variants={formVariants}
          className="glass"
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, var(--text-primary) 30%, var(--accent-color) 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
              }}
            >
              Create Account
            </Typography>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255, 56, 92, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--accent-color)',
                    border: '1px solid var(--accent-color)',
                    '& .MuiAlert-icon': {
                      color: 'var(--accent-color)',
                    },
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={inputVariants}>
                  {renderTextField('name', 'Full Name', 'text', 
                    <PersonOutline sx={{ color: 'var(--accent-color)' }} />
                  )}
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={inputVariants}>
                  {renderTextField('email', 'Email Address', 'email',
                    <Email sx={{ color: 'var(--accent-color)' }} />
                  )}
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={inputVariants}>
                  {renderTextField('password', 'Password', 'password',
                    <Lock sx={{ color: 'var(--accent-color)' }} />
                  )}
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div variants={inputVariants}>
                  {renderTextField('phone', 'Phone Number', 'tel',
                    <Phone sx={{ color: 'var(--accent-color)' }} />
                  )}
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div variants={inputVariants}>
                  {renderTextField('nid', 'NID Number', 'text',
                    <Badge sx={{ color: 'var(--accent-color)' }} />
                  )}
                </motion.div>
              </Grid>
            </Grid>

            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                fullWidth
                type="submit"
                disabled={loading}
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, var(--accent-color) 30%, var(--primary-color) 90%)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, var(--accent-color) 30%, var(--primary-color) 90%)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.div>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    style={{
                      color: 'var(--accent-color)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        color: 'var(--primary-color)',
                      },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
