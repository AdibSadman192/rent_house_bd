import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Bookmark,
  MoreVert,
  Delete,
  Edit,
  FolderSpecial,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/PropertyCard';
import SavedPostStats from '../components/SavedPostStats';

function SavedPosts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [savedPosts, setSavedPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [newCollection, setNewCollection] = useState('');
  const [error, setError] = useState('');

  // Fetch saved posts and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, collectionsRes] = await Promise.all([
          fetch('/api/v1/saved-posts', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }),
          fetch('/api/v1/saved-posts/collections', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })
        ]);

        const postsData = await postsRes.json();
        const collectionsData = await collectionsRes.json();

        setSavedPosts(postsData.data);
        setCollections(collectionsData.data);
      } catch (err) {
        setError('Failed to fetch saved posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleAddToCollection = async () => {
    if (!newCollection.trim()) return;

    try {
      const response = await fetch(`/api/v1/saved-posts/${selectedPost._id}/collections`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          collections: [newCollection.trim()]
        })
      });

      if (!response.ok) throw new Error('Failed to add to collection');

      // Refresh collections
      const collectionsRes = await fetch('/api/v1/saved-posts/collections', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const collectionsData = await collectionsRes.json();
      setCollections(collectionsData.data);

      setShowCollectionDialog(false);
      setNewCollection('');
    } catch (err) {
      setError('Failed to add to collection');
    }
  };

  const handleDeletePost = async () => {
    try {
      await fetch(`/api/v1/saved-posts/${selectedPost._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setSavedPosts(posts => posts.filter(p => p._id !== selectedPost._id));
      handleMenuClose();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Saved Posts
        </Typography>
        <IconButton onClick={() => setShowStats(true)} color="primary">
          <Assessment />
        </IconButton>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Saved" />
        <Tab label="Collections" />
      </Tabs>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {savedPosts.map(saved => (
            <Grid item xs={12} sm={6} md={4} key={saved._id}>
              <Card>
                <PropertyCard post={saved.postId} />
                <CardContent>
                  {saved.collections.map(collection => (
                    <Chip
                      key={collection}
                      label={collection}
                      size="small"
                      icon={<FolderSpecial />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {saved.notes && (
                      <Typography variant="body2" color="text.secondary">
                        {saved.notes}
                      </Typography>
                    )}
                    <IconButton onClick={(e) => handleMenuClick(e, saved)}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {collections.map(collection => (
            <Grid item xs={12} sm={6} md={4} key={collection.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{collection.name}</Typography>
                  <Typography color="text.secondary">
                    {collection.count} posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setShowCollectionDialog(true)}>
          <FolderSpecial sx={{ mr: 1 }} /> Add to Collection
        </MenuItem>
        <MenuItem onClick={handleDeletePost}>
          <Delete sx={{ mr: 1 }} /> Remove from Saved
        </MenuItem>
      </Menu>

      <Dialog open={showCollectionDialog} onClose={() => setShowCollectionDialog(false)}>
        <DialogTitle>Add to Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCollectionDialog(false)}>Cancel</Button>
          <Button onClick={handleAddToCollection} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showStats}
        onClose={() => setShowStats(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Your Saved Posts Statistics</DialogTitle>
        <DialogContent>
          <SavedPostStats />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStats(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SavedPosts;
