import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  DeleteForever as DeleteForeverIcon,
  Warning as WarningIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmation: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required'),
      confirmation: Yup.string()
        .required('Please type "DELETE" to confirm')
        .matches(/^DELETE$/, 'Please type "DELETE" to confirm'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        setConfirmDialog(true);
      } catch (error) {
        setError('An error occurred. Please try again.');
        setSubmitting(false);
      }
    },
  });

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`,
        {
          data: { password: formik.values.password },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Account deleted successfully');
      logout();
      router.push('/login');
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error deleting account'
      );
      setConfirmDialog(false);
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
                <DeleteForeverIcon
                  sx={{ fontSize: 40, color: 'error.main', mb: 1 }}
                />
                <Typography variant="h5" component="h1" gutterBottom>
                  Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This action is permanent and cannot be undone
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Deleting your account will:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  <li>Permanently delete your profile</li>
                  <li>Remove all your properties</li>
                  <li>Cancel all your bookings</li>
                  <li>Delete all your reviews</li>
                  <li>Remove all your data from our system</li>
                </ul>
              </Alert>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password &&
                    Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password && formik.errors.password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
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
                  id="confirmation"
                  name="confirmation"
                  label='Type "DELETE" to confirm'
                  value={formik.values.confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmation &&
                    Boolean(formik.errors.confirmation)
                  }
                  helperText={
                    formik.touched.confirmation &&
                    formik.errors.confirmation
                  }
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  sx={{
                    py: 1.5,
                    position: 'relative',
                    '&.Mui-disabled': {
                      backgroundColor: 'error.main',
                      color: 'white',
                      opacity: 0.7,
                    },
                  }}
                  startIcon={<DeleteForeverIcon />}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: 'white',
                        position: 'absolute',
                        left: '50%',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Paper>
      </Box>

      {/* Final Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Final Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you absolutely sure you want to delete your account? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
          >
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DeleteAccount;
