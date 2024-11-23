import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Avatar,
  Flex,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Icon,
} from '@chakra-ui/react';
import {
  CheckIcon,
  CloseIcon,
  WarningIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import axios from 'axios';
import PropertyCard from './PropertyCard';

const AdminApproval = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [actionType, setActionType] = useState('');
  const [stats, setStats] = useState({
    pendingCount: 0,
    reportedPostsCount: 0,
    reportedUsersCount: 0,
    totalApproved: 0,
    totalRejected: 0,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        pendingResponse,
        reportedPostsResponse,
        reportedUsersResponse,
        statsResponse,
      ] = await Promise.all([
        axios.get('/api/admin/pending-posts'),
        axios.get('/api/admin/reported-posts'),
        axios.get('/api/admin/reported-users'),
        axios.get('/api/admin/stats'),
      ]);

      setPendingPosts(pendingResponse.data);
      setReportedPosts(reportedPostsResponse.data);
      setReportedUsers(reportedUsersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAction = async () => {
    try {
      let endpoint;
      if (selectedItem.type === 'post') {
        endpoint = `/api/admin/posts/${selectedItem.id}/${actionType}`;
      } else {
        endpoint = `/api/admin/users/${selectedItem.id}/${actionType}`;
      }

      await axios.post(endpoint, { reason: actionReason });

      toast({
        title: 'Success',
        description: `${selectedItem.type === 'post' ? 'Post' : 'User'} ${actionType}d successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      fetchData();
      onClose();
      setActionReason('');
      setActionType('');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${actionType} ${selectedItem.type}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const ActionModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {actionType.charAt(0).toUpperCase() + actionType.slice(1)}{' '}
          {selectedItem?.type}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              placeholder="Select action"
            >
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="ban">Ban</option>
            </Select>
            <Textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Enter reason for action"
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={
              actionType === 'approve'
                ? 'green'
                : actionType === 'reject'
                ? 'red'
                : 'yellow'
            }
            onClick={handleAction}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const StatCard = ({ label, value, icon }) => (
    <Stat
      px={4}
      py={2}
      bg={bgColor}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
    >
      <StatLabel fontSize="sm" color="gray.500">
        <HStack>
          <Icon as={icon} />
          <Text>{label}</Text>
        </HStack>
      </StatLabel>
      <StatNumber fontSize="2xl">{value}</StatNumber>
    </Stat>
  );

  const PostItem = ({ post, type }) => (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
    >
      <PropertyCard property={post} variant="list" />
      <Divider my={4} />
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.500">
            Submitted by: {post.owner.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Date: {format(new Date(post.createdAt), 'PPP')}
          </Text>
          {type === 'reported' && (
            <Badge colorScheme="red">
              {post.reports?.length} report(s)
            </Badge>
          )}
        </VStack>
        <HStack>
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<CheckIcon />}
            onClick={() => {
              setSelectedItem({ id: post._id, type: 'post' });
              setActionType('approve');
              onOpen();
            }}
          >
            Approve
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<CloseIcon />}
            onClick={() => {
              setSelectedItem({ id: post._id, type: 'post' });
              setActionType('reject');
              onOpen();
            }}
          >
            Reject
          </Button>
        </HStack>
      </HStack>
    </Box>
  );

  const UserItem = ({ user }) => (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
    >
      <HStack spacing={4}>
        <Avatar size="md" name={user.name} src={user.avatar} />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Member since: {format(new Date(user.createdAt), 'PPP')}
          </Text>
          <Badge colorScheme="red">
            {user.reports?.length} report(s)
          </Badge>
        </VStack>
        <Button
          colorScheme="red"
          leftIcon={<WarningIcon />}
          onClick={() => {
            setSelectedItem({ id: user._id, type: 'user' });
            setActionType('ban');
            onOpen();
          }}
        >
          Ban User
        </Button>
      </HStack>
    </Box>
  );

  return (
    <Box>
      <StatGroup mb={6} gap={4}>
        <StatCard
          label="Pending Posts"
          value={stats.pendingCount}
          icon={InfoIcon}
        />
        <StatCard
          label="Reported Posts"
          value={stats.reportedPostsCount}
          icon={WarningIcon}
        />
        <StatCard
          label="Reported Users"
          value={stats.reportedUsersCount}
          icon={WarningIcon}
        />
        <StatCard
          label="Total Approved"
          value={stats.totalApproved}
          icon={CheckIcon}
        />
      </StatGroup>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Pending Posts ({pendingPosts.length})</Tab>
          <Tab>Reported Posts ({reportedPosts.length})</Tab>
          <Tab>Reported Users ({reportedUsers.length})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {pendingPosts.map((post) => (
                <PostItem key={post._id} post={post} type="pending" />
              ))}
              {pendingPosts.length === 0 && (
                <Text textAlign="center" color="gray.500">
                  No pending posts
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {reportedPosts.map((post) => (
                <PostItem key={post._id} post={post} type="reported" />
              ))}
              {reportedPosts.length === 0 && (
                <Text textAlign="center" color="gray.500">
                  No reported posts
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {reportedUsers.map((user) => (
                <UserItem key={user._id} user={user} />
              ))}
              {reportedUsers.length === 0 && (
                <Text textAlign="center" color="gray.500">
                  No reported users
                </Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ActionModal />
    </Box>
  );
};

export default AdminApproval;
