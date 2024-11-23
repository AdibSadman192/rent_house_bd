import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Grid,
  Text,
  Button,
  HStack,
  useToast,
  Spinner,
  Center,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, ViewOffIcon, SettingsIcon } from '@chakra-ui/icons';
import PropertyCard from './PropertyCard';
import SearchFilters from './SearchFilters';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const toast = useToast();
  const { user } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchPosts();
  }, [filters, sortBy]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts', {
        params: {
          ...filters,
          sortBy,
          search: searchQuery,
        },
      });
      setPosts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFavoriteToggle = async (postId, isFavorited) => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to save favorites',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post('/api/favorites', {
        postId,
        action: isFavorited ? 'add' : 'remove',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePostAction = async (postId, action) => {
    try {
      await axios.post(`/api/posts/${postId}/${action}`);
      fetchPosts();
      toast({
        title: 'Success',
        description: `Post ${action} successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} post`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const PostActions = ({ post }) => (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<SettingsIcon />}
        variant="ghost"
        aria-label="Post actions"
      />
      <MenuList>
        {user?.role === 'admin' && (
          <>
            <MenuItem onClick={() => handlePostAction(post._id, 'approve')}>
              Approve
            </MenuItem>
            <MenuItem onClick={() => handlePostAction(post._id, 'reject')}>
              Reject
            </MenuItem>
          </>
        )}
        {(user?.role === 'admin' || user?._id === post.owner) && (
          <MenuItem onClick={() => handlePostAction(post._id, 'delete')}>
            Delete
          </MenuItem>
        )}
        <MenuItem onClick={() => handlePostAction(post._id, 'report')}>
          Report
        </MenuItem>
      </MenuList>
    </Menu>
  );

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box
          p={4}
          bg={bgColor}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
        >
          <form onSubmit={handleSearch}>
            <HStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by location, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Select
                w="200px"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </Select>
              <IconButton
                icon={viewMode === 'grid' ? <ViewIcon /> : <ViewOffIcon />}
                onClick={() =>
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                }
                aria-label="Toggle view"
              />
            </HStack>
          </form>
        </Box>

        <SearchFilters onFilterChange={handleFilterChange} />

        {posts.length === 0 ? (
          <Center p={8}>
            <Text>No posts found matching your criteria.</Text>
          </Center>
        ) : (
          <Grid
            templateColumns={
              viewMode === 'grid'
                ? {
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  }
                : '1fr'
            }
            gap={6}
          >
            {posts.map((post) => (
              <Box key={post._id} position="relative">
                <PropertyCard
                  property={post}
                  variant={viewMode}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorited={post.favorites?.includes(user?._id)}
                />
                <Box position="absolute" top={2} right={2} zIndex={1}>
                  <PostActions post={post} />
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
};

export default PostList;
