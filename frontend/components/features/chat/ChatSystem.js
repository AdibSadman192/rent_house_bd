import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Badge,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import io from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const ChatSystem = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
      query: { userId: user?._id }
    });

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      // Update conversation list with latest message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    });

    // Fetch conversations on mount
    fetchConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/conversations');
      setConversations(data.conversations);
    } catch (error) {
      toast.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/conversations/${conversationId}/messages`);
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const { data } = await axios.post(`/api/conversations/${selectedConversation._id}/messages`, {
        content: newMessage
      });
      
      // Emit message through socket
      socketRef.current.emit('sendMessage', {
        conversationId: selectedConversation._id,
        message: data.message
      });

      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  if (loading && !conversations.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" height="calc(100vh - 200px)" gap={2}>
      {/* Conversations List */}
      <Paper sx={{ width: 320, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Conversations
        </Typography>
        <List>
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <ListItem
                key={conversation._id}
                button
                selected={selectedConversation?._id === conversation._id}
                onClick={() => setSelectedConversation(conversation)}
              >
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!otherParticipant?.isOnline}
                  >
                    <Avatar src={otherParticipant?.avatar}>
                      {otherParticipant?.name?.[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={otherParticipant?.name}
                  secondary={conversation.lastMessage?.content}
                  secondaryTypographyProps={{
                    noWrap: true,
                    style: {
                      maxWidth: 200
                    }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Chat Window */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar
                src={getOtherParticipant(selectedConversation)?.avatar}
                sx={{ mr: 2 }}
              >
                {getOtherParticipant(selectedConversation)?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {getOtherParticipant(selectedConversation)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getOtherParticipant(selectedConversation)?.isOnline
                    ? 'Online'
                    : 'Offline'}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message._id}
                  alignSelf={message.sender === user?._id ? 'flex-end' : 'flex-start'}
                  sx={{ maxWidth: '70%' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1,
                      bgcolor: message.sender === user?._id ? 'primary.main' : 'grey.100',
                      color: message.sender === user?._id ? 'white' : 'inherit'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true
                    })}
                  </Typography>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <form onSubmit={handleSendMessage}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <AttachFileIcon />
                        </IconButton>
                        <IconButton>
                          <ImageIcon />
                        </IconButton>
                        <IconButton
                          type="submit"
                          color="primary"
                          disabled={!newMessage.trim() || sending}
                        >
                          {sending ? (
                            <CircularProgress size={24} />
                          ) : (
                            <SendIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography color="text.secondary">
              Select a conversation to start chatting
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatSystem;
