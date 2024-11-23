import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Stack,
  Typography,
  useTheme,
  Drawer,
  Avatar,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  ArrowUpward as ArrowUpIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot', {
        message: input,
        userId: user?._id,
      });

      const botMessage = {
        type: 'bot',
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setCurrentInteraction({
        userMessage: input,
        botResponse: response.data.message,
      });
      setShowFeedback(true);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = async (isHelpful) => {
    if (!currentInteraction) return;

    try {
      await axios.post('/api/feedback', {
        userId: user?._id,
        userMessage: currentInteraction.userMessage,
        botResponse: currentInteraction.botResponse,
        isHelpful,
      });
      setShowFeedback(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <ChatIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">House Rental Assistant</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            p: 2,
            height: 'calc(100vh - 180px)',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      message.type === 'user'
                        ? theme.palette.primary.main
                        : theme.palette.grey[100],
                    color: message.type === 'user' ? 'white' : 'inherit',
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    }}
                  >
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Assistant is typing...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>

          {showFeedback && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: theme.palette.grey[100],
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Was this response helpful?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<StarIcon />}
                  onClick={() => handleFeedback(true)}
                  variant="contained"
                  color="success"
                >
                  Yes
                </Button>
                <Button
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => handleFeedback(false)}
                  variant="contained"
                  color="error"
                >
                  No
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              <ArrowUpIcon />
            </IconButton>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Chatbot;
