import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  useToast,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useColorModeValue,
  Spinner,
  Flex,
  Divider,
  Select,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  TimeIcon,
  SettingsIcon,
  InfoIcon,
  CheckIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { format, isAfter } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import useSocket from '../hooks/useSocket';

const MESSAGE_EXPIRY_OPTIONS = [
  { value: 3600, label: '1 Hour' },
  { value: 86400, label: '24 Hours' },
  { value: 604800, label: '1 Week' },
  { value: 2592000, label: '30 Days' },
  { value: 0, label: 'Never' },
];

const Chat = ({ propertyId, recipientId, isRenter }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [expiryTime, setExpiryTime] = useState(86400); // Default 24 hours
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();
  const toast = useToast();
  const { isConnected, connect, emit, on, off } = useSocket();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (!user?._id || !propertyId) return;

    // Initialize socket connection
    const connected = connect();
    if (!connected) return;

    // Set up event listeners
    on('new_message', handleNewMessage);
    on('user_typing', handleUserTyping);
    on('user_stopped_typing', handleUserStopTyping);
    on('message_expired', handleMessageExpiry);
    on('messages_read', handleMessagesRead);

    // Join the chat room
    emit('join_chat', propertyId);

    // Fetch existing messages
    fetchMessages();

    // Cleanup function
    return () => {
      off('new_message', handleNewMessage);
      off('user_typing', handleUserTyping);
      off('user_stopped_typing', handleUserStopTyping);
      off('message_expired', handleMessageExpiry);
      off('messages_read', handleMessagesRead);
    };
  }, [propertyId, user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for expired messages periodically
  useEffect(() => {
    const interval = setInterval(checkExpiredMessages, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [messages, expiryTime]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/chat/${propertyId}/${recipientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError('Failed to load messages');
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  const handleUserTyping = ({ user: typingUser }) => {
    setIsTyping(true);
    setTypingUser(typingUser);
  };

  const handleUserStopTyping = () => {
    setIsTyping(false);
    setTypingUser(null);
  };

  const handleMessageExpiry = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    toast({
      title: 'Message Expired',
      description: 'A message has been automatically removed due to expiry',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleMessagesRead = ({ messageIds }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg._id)
          ? { ...msg, readBy: [...msg.readBy, user._id] }
          : msg
      )
    );
  };

  const markMessagesAsRead = () => {
    const unreadMessages = messages
      .filter((msg) => !msg.readBy.includes(user._id))
      .map((msg) => msg._id);

    if (unreadMessages.length > 0) {
      emit('mark_read', { chatId: propertyId, messageIds: unreadMessages });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkExpiredMessages = () => {
    if (expiryTime === 0) return; // Skip if messages never expire

    const now = new Date();
    setMessages((prev) =>
      prev.filter((msg) => {
        const expiryDate = new Date(msg.createdAt.getTime() + expiryTime * 1000);
        return isAfter(expiryDate, now);
      })
    );
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = {
        content: newMessage,
        sender: user._id,
        recipient: recipientId,
        propertyId,
        expiresAt: expiryTime ? new Date(Date.now() + expiryTime * 1000) : null,
      };

      emit('new_message', message);
      setNewMessage('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTyping = () => {
    emit('user_typing', { propertyId, recipientId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      emit('user_stopped_typing', { propertyId, recipientId });
    }, 2000);
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        emit('message_deleted', { messageId, propertyId, recipientId });
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!isConnected) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" mb={4} />
        <Text>Connecting to chat server...</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="200px" color="red.500">
        <WarningIcon mr={2} />
        <Text>{error}</Text>
      </Flex>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      h="full"
      p={4}
    >
      {/* Chat Header */}
      <HStack p={4} borderBottomWidth="1px" borderColor={borderColor}>
        <Avatar size="sm" name={recipientId} />
        <VStack align="start" flex={1} spacing={0}>
          <Text fontWeight="bold">{recipientId}</Text>
          <Text fontSize="sm" color="gray.500">
            {isRenter ? 'Property Owner' : 'Potential Renter'}
          </Text>
        </VStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon />}
            variant="ghost"
            aria-label="Chat settings"
          />
          <MenuList>
            <MenuItem>
              <Select
                value={expiryTime}
                onChange={(e) => setExpiryTime(Number(e.target.value))}
                size="sm"
              >
                {MESSAGE_EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Messages Container */}
      <VStack
        flex={1}
        overflowY="auto"
        p={4}
        spacing={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: useColorModeValue('gray.100', 'gray.700'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '4px',
          },
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        {isTyping && (
          <HStack alignSelf="flex-start">
            <Spinner size="xs" />
            <Text fontSize="sm" color="gray.500">
              {typingUser} is typing...
            </Text>
          </HStack>
        )}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Message Input */}
      <HStack p={4} borderTopWidth="1px" borderColor={borderColor}>
        <Input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          colorScheme="blue"
          onClick={sendMessage}
          isDisabled={!newMessage.trim()}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
};

const MessageBubble = ({ message }) => {
  const isSender = message.sender === user._id;
  const bubbleBg = isSender ? 'blue.500' : useColorModeValue('gray.100', 'gray.700');
  const textColor = isSender ? 'white' : useColorModeValue('gray.800', 'white');

  return (
    <Box
      maxW="70%"
      alignSelf={isSender ? 'flex-end' : 'flex-start'}
      bg={bubbleBg}
      color={textColor}
      px={4}
      py={2}
      borderRadius="lg"
      position="relative"
    >
      <Text>{message.content}</Text>
      <HStack spacing={2} justify="flex-end" mt={1} fontSize="xs" opacity={0.8}>
        <Text>{format(new Date(message.createdAt), 'HH:mm')}</Text>
        {message.expiresAt && (
          <Tooltip label={`Expires: ${format(new Date(message.expiresAt), 'PPp')}`}>
            <TimeIcon />
          </Tooltip>
        )}
        {isSender && (
          <IconButton
            icon={<DeleteIcon />}
            size="xs"
            variant="ghost"
            onClick={() => deleteMessage(message._id)}
            aria-label="Delete message"
          />
        )}
      </HStack>
    </Box>
  );
};

export default Chat;
