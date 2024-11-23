import React, { useState, useEffect } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotification();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getTimeString = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.abs(now - notificationDate) / 36e5;

    if (diffInHours < 24) {
      return formatDistanceToNow(notificationDate, { addSuffix: true });
    }
    return format(notificationDate, 'MMM dd, yyyy HH:mm');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              <IconButton
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ color: 'white', mr: 1 }}
                disabled={unreadCount === 0}
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ height: 400, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              <List>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItem
                      button
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{
                        bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary={getTimeString(notification.createdAt)}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: notification.read ? 'textPrimary' : 'primary',
                        }}
                      />
                      {!notification.read && (
                        <CircleIcon
                          sx={{
                            fontSize: 12,
                            color: theme.palette.primary.main,
                            ml: 1,
                          }}
                        />
                      )}
                    </ListItem>
                    <Divider />
                  </motion.div>
                ))}
              </List>
            </AnimatePresence>
          )}
        </Box>

        <Divider />

        <Box
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Button
            size="small"
            startIcon={<SettingsIcon />}
            onClick={() => {
              handleClose();
              // Navigate to notification settings
              router.push('/settings/notifications');
            }}
          >
            Settings
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={handleClose}
          >
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
