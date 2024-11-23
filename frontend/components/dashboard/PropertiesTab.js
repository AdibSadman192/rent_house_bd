import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

const PropertyCard = ({ property, onEdit, onDelete }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    router.push(`/properties/${property.id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(property);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(property);
    handleMenuClose();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={property.images[0]}
        alt={property.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {property.title}
          </Typography>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {property.description.substring(0, 100)}...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${property.price}/month
          </Typography>
          <Chip
            label={property.status}
            color={property.status === 'Available' ? 'success' : 'warning'}
            size="small"
          />
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

const PropertiesTab = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/properties', {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      setProperties(response.data.data);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const handleEdit = (property) => {
    // Implement edit functionality
    console.log('Edit property:', property);
  };

  const handleDelete = async (property) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/properties/${property.id}`);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete property');
      console.error('Error deleting property:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/properties/create')}
        >
          Add Property
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <PropertyCard
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PropertiesTab;
