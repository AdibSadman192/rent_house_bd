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
  IconButton,
  InputAdornment,
  Fade,
  Grow
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
import SettingsLayout from '../../components/layout/SettingsLayout';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const DeleteAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmText: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required'),
      confirmText: Yup.string()
        .required('Please type "DELETE" to confirm')
        .matches(/^DELETE$/, 'Please type "DELETE" exactly as shown'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axiosInstance.post('/api/user/delete-account', {
          password: values.password,
        });
        setConfirmDialog(false);
        await logout();
        toast.success('Your account has been deleted successfully');
        router.push('/');
      } catch (error) {
        toast.error(error.message || 'Failed to delete account');
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <SettingsLayout title="Delete Account">
      <Fade in timeout={500}>
        <Box>
          <Grow in timeout={800}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DeleteForeverIcon color="error" sx={{ fontSize: 30, mr: 1 }} />
                  <Typography variant="h5" color="error">
                    Delete Account
                  </Typography>
                </Box>

                <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
                  Warning: This action cannot be undone. All your data will be permanently deleted.
                </Alert>

                <Typography variant="body1" paragraph>
                  Before proceeding, please understand that:
                </Typography>
                <ul>
                  <li>All your personal information will be erased</li>
                  <li>Your property listings will be removed</li>
                  <li>Your booking history will be deleted</li>
                  <li>You will lose access to all services</li>
                </ul>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => setConfirmDialog(true)}
                    fullWidth
                  >
                    Delete My Account
                  </Button>
                </Box>

                <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
                  <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon color="error" sx={{ mr: 1 }} />
                      Confirm Account Deletion
                    </Box>
                  </DialogTitle>
                  <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        This action is irreversible!
                      </Alert>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        id="confirmText"
                        name="confirmText"
                        label='Type "DELETE" to confirm'
                        value={formik.values.confirmText}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmText && Boolean(formik.errors.confirmText)}
                        helperText={formik.touched.confirmText && formik.errors.confirmText}
                        margin="normal"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
                      <Button
                        type="submit"
                        color="error"
                        disabled={formik.isSubmitting}
                        startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
                      >
                        {formik.isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                      </Button>
                    </DialogActions>
                  </form>
                </Dialog>
              </CardContent>
            </Card>
          </Grow>
        </Box>
      </Fade>
    </SettingsLayout>
  );
};

export default DeleteAccount;
