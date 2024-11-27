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
  CircularProgress,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Bookmark,
  MoreVert,
  Delete,
  Edit,
  FolderSpecial,
  Assessment,
  Collections
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/PropertyCard';
import SavedPostStats from '../components/SavedPostStats';
import { motion } from 'framer-motion';
import { Fade, Grow, Zoom } from '@mui/material';

const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);

function SavedPosts() {
  const theme = useTheme();
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
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        py: 4,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
      }}
    >
      <Fade in timeout={500}>
        <Box>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={4}
            sx={{
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              borderRadius: 2,
              p: 3,
              boxShadow: theme.shadows[4]
            }}
          >
            <Box display="flex" alignItems="center">
              <Zoom in style={{ transitionDelay: '100ms' }}>
                <Collections sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }} />
              </Zoom>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Saved Posts
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowStats(true)} 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <Assessment />
            </IconButton>
          </Box>

          <Paper
            elevation={0}
            sx={{
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              borderRadius: 2,
              mb: 4,
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
                '& .MuiTab-root': {
                  color: theme.palette.text.secondary,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }
              }}
            >
              <Tab label="All Saved" />
              <Tab label="Collections" />
            </Tabs>
          </Paper>

          {error && (
            <Fade in timeout={300}>
              <Typography 
                color="error" 
                sx={{ 
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.error.main, 0.1)
                }}
              >
                {error}
              </Typography>
            </Fade>
          )}

          {tabValue === 0 && (
            <MotionGrid 
              container 
              spacing={3}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {savedPosts.map((saved, index) => (
                <Grid item xs={12} sm={6} md={4} key={saved._id}>
                  <Grow in timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        borderRadius: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8]
                        }
                      }}
                    >
                      <PropertyCard post={saved.postId} />
                      <CardContent>
                        <Box mb={2}>
                          {saved.collections.map(collection => (
                            <Chip
                              key={collection}
                              label={collection}
                              size="small"
                              icon={<FolderSpecial />}
                              sx={{ 
                                mr: 1, 
                                mb: 1,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                '& .MuiChip-icon': {
                                  color: theme.palette.primary.main
                                }
                              }}
                            />
                          ))}
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          {saved.notes && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                fontStyle: 'italic',
                                opacity: 0.8
                              }}
                            >
                              {saved.notes}
                            </Typography>
                          )}
                          <IconButton 
                            onClick={(e) => handleMenuClick(e, saved)}
                            sx={{
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </MotionGrid>
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
        </Box>
      </Fade>
    </MotionContainer>
  );
}

export default SavedPosts;
