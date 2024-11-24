import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import {
  initializeSocket,
  disconnectSocket,
  emitEvent,
  onEvent,
  offEvent,
} from '../utils/socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const connect = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?._id) {
        toast({
          title: 'Authentication Error',
          description: 'Please login to use the chat feature',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }

      const socket = initializeSocket(token);

      socket.on('connect', () => {
        setIsConnected(true);
        toast({
          title: 'Connected',
          description: 'Successfully connected to chat server',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        toast({
          title: 'Disconnected',
          description: 'Lost connection to chat server',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      });

      socket.on('connect_error', (error) => {
        setIsConnected(false);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to chat server',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [user?._id, toast]);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    emit: emitEvent,
    on: onEvent,
    off: offEvent,
  };
};

export default useSocket;
