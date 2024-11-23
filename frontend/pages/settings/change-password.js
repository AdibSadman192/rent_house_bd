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
  Fade,
  Grow,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import SettingsLayout from '../../components/layout/SettingsLayout';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axiosInstance.put('/api/user/change-password', {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        
        toast.success('Password changed successfully! Please log in again.');
        await logout();
        router.push('/auth/login');
      } catch (error) {
        toast.error(error.message || 'Failed to change password');
        setSubmitting(false);
      }
    },
  });

  const handleTogglePassword = (field) => {
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
    <SettingsLayout title="Change Password">
      <Fade in timeout={500}>
        <Box>
          <Grow in timeout={800}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LockIcon sx={{ fontSize: 30, mr: 1 }} />
                  <Typography variant="h5">
                    Change Password
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Alert severity="info" sx={{ mb: 3 }}>
                  Your password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                </Alert>

                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePassword('current')}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePassword('new')}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePassword('confirm')}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={formik.isSubmitting}
                      startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grow>
        </Box>
      </Fade>
    </SettingsLayout>
  );
};

export default ChangePassword;
