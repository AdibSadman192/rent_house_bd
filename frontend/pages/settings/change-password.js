import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required('Current password is required')
        .min(8, 'Password must be at least 8 characters'),
      newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .notOneOf(
          [Yup.ref('currentPassword')],
          'New password must be different from current password'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setError('');
        setSuccess('');
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setSuccess('Password changed successfully! You will be logged out in 3 seconds.');
        resetForm();
        
        // Logout after 3 seconds
        setTimeout(() => {
          logout();
          router.push('/login');
        }, 3000);

      } catch (err) {
        setError(
          err.response?.data?.message || 
          'An error occurred while changing password. Please try again.'
        );
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          p: 2,
        }}
      >
        <Paper elevation={3}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <LockIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h5" component="h1" gutterBottom>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please enter your current password and choose a new password
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.currentPassword &&
                    Boolean(formik.errors.currentPassword)
                  }
                  helperText={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{
                    py: 1.5,
                    position: 'relative',
                    '&.Mui-disabled': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Password must:
                </Typography>
                <Typography
                  component="ul"
                  variant="body2"
                  color="text.secondary"
                  sx={{ pl: 2 }}
                >
                  <li>Be at least 8 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one lowercase letter</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character (@$!%*?&)</li>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default ChangePassword;
