import React, { useState, useEffect } from 'react';
import {
  Popover,
  IconButton,
  Badge,
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  Fade
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CheckCircleOutline as MarkReadIcon,
  Delete as ClearIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationList from './NotificationList';

const NotificationPopover = () => {
  const theme = useTheme();
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    loading
  } = useNotification();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showBadge, setShowBadge] = useState(false);

  // Animate badge when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [unreadCount]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    router.push('/settings/notifications');
    handleClose();
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        color="inherit"
        aria-describedby={id}
        onClick={handleClick}
        size="large"
      >
        <Fade in={showBadge}>
          {showBadge ? (
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>
          ) : (
            <NotificationsIcon />
          )}
        </Fade>
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
            maxHeight: '80vh',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" component="div">
            Notifications
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{ mr: 1 }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ height: 400, overflow: 'auto' }}>
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            loading={loading}
          />
        </Box>

        <Divider />

        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            bgcolor: 'background.default'
          }}
        >
          <Button
            size="small"
            startIcon={<MarkReadIcon />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear all
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
