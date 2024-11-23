import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Grid,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Badge,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// User Dashboard Component
const UserDashboard = ({ posts }) => {
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
      {posts.map((post) => (
        <Box
          key={post._id}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
        >
          <Text fontSize="xl" fontWeight="bold">
            {post.title}
          </Text>
          <Text mt={2}>{post.description}</Text>
          <Text mt={2} fontWeight="bold">
            Price: ${post.price}
          </Text>
          <Text>Location: {post.location}</Text>
          <Button colorScheme="blue" mt={4} w="full">
            Book Now
          </Button>
        </Box>
      ))}
    </Grid>
  );
};

// Renter Dashboard Component
const RenterDashboard = () => {
  const [posts, setPosts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
  });
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/me`
      );
      setPosts(response.data.data);
    } catch (error) {
      toast({
        title: 'Error fetching posts',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${editingId}`,
          formData
        );
        toast({
          title: 'Post updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
          formData
        );
        toast({
          title: 'Post created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      onClose();
      setFormData({ title: '', description: '', location: '', price: '' });
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      toast({
        title: error.response?.data?.message || 'Error saving post',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      description: post.description,
      location: post.location,
      price: post.price,
    });
    setEditingId(post._id);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
      toast({
        title: 'Post deleted successfully',
        status: 'success',
        duration: 3000,
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: 'Error deleting post',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <Button colorScheme="blue" mb={6} onClick={onOpen}>
        Create New Post
      </Button>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {posts.map((post) => (
          <Box
            key={post._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
          >
            <HStack justify="space-between" mb={2}>
              <Badge colorScheme={post.approved ? 'green' : 'yellow'}>
                {post.approved ? 'Approved' : 'Pending'}
              </Badge>
              <HStack>
                <IconButton
                  icon={<FaEdit />}
                  onClick={() => handleEdit(post)}
                  aria-label="Edit post"
                  size="sm"
                />
                <IconButton
                  icon={<FaTrash />}
                  onClick={() => handleDelete(post._id)}
                  aria-label="Delete post"
                  size="sm"
                  colorScheme="red"
                />
              </HStack>
            </HStack>
            <Text fontSize="xl" fontWeight="bold">
              {post.title}
            </Text>
            <Text mt={2}>{post.description}</Text>
            <Text mt={2} fontWeight="bold">
              Price: ${post.price}
            </Text>
            <Text>Location: {post.location}</Text>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? 'Edit Post' : 'Create New Post'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  {editingId ? 'Update Post' : 'Create Post'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`),
      ]);
      setUsers(usersRes.data.data);
      setPosts(postsRes.data.data);
    } catch (error) {
      toast({
        title: 'Error fetching data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleApprovePost = async (id, approved) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/approve/${id}`,
        { approved }
      );
      toast({
        title: `Post ${approved ? 'approved' : 'rejected'} successfully`,
        status: 'success',
        duration: 3000,
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error updating post status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
        <Tab>Posts</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>NID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        user.role === 'admin'
                          ? 'red'
                          : user.role === 'renter'
                          ? 'green'
                          : 'blue'
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>{user.nid}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TabPanel>
        <TabPanel>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Renter</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts.map((post) => (
                <Tr key={post._id}>
                  <Td>{post.title}</Td>
                  <Td>{post.ownerId.name}</Td>
                  <Td>
                    <Badge
                      colorScheme={post.approved ? 'green' : 'yellow'}
                    >
                      {post.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaCheck />}
                        colorScheme="green"
                        onClick={() => handleApprovePost(post._id, true)}
                        aria-label="Approve post"
                        size="sm"
                        isDisabled={post.approved}
                      />
                      <IconButton
                        icon={<FaTimes />}
                        colorScheme="red"
                        onClick={() => handleApprovePost(post._id, false)}
                        aria-label="Reject post"
                        size="sm"
                        isDisabled={!post.approved}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`
      );
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  if (!user) return null;

  return (
    <Container maxW="container.xl" py={10}>
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Welcome, {user.name}!
      </Text>

      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : user.role === 'renter' ? (
        <RenterDashboard />
      ) : (
        <UserDashboard posts={posts} />
      )}
    </Container>
  );
};

export default Dashboard;
