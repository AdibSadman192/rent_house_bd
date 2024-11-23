import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  useTheme,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as MarkReadIcon,
  Home as PropertyIcon,
  Payment as PaymentIcon,
  Message as MessageIcon,
  Campaign as MarketingIcon,
  BookOnline as BookingIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationList = ({
  notifications = [],
  onMarkAsRead,
  onDelete,
  emptyMessage = 'No notifications',
  maxHeight = 400
}) => {
  const theme = useTheme();

  const getIcon = (type, category) => {
    // Status icons
    const statusIcons = {
      success: <SuccessIcon color="success" />,
      error: <ErrorIcon color="error" />,
      warning: <WarningIcon color="warning" />,
      info: <InfoIcon color="info" />
    };

    // Category icons
    const categoryIcons = {
      property: <PropertyIcon />,
      payment: <PaymentIcon />,
      message: <MessageIcon />,
      marketing: <MarketingIcon />,
      booking: <BookingIcon />
    };

    return statusIcons[type] || categoryIcons[category] || <InfoIcon />;
  };

  const getNotificationStyle = (priority) => {
    const styles = {
      urgent: {
        backgroundColor: theme.palette.error.light,
        '&:hover': {
          backgroundColor: theme.palette.error.main,
        }
      },
      high: {
        backgroundColor: theme.palette.warning.light,
        '&:hover': {
          backgroundColor: theme.palette.warning.main,
        }
      },
      medium: {},
      low: {}
    };

    return styles[priority] || {};
  };

  if (notifications.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={100}
      >
        <Typography color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: '100%',
        maxHeight,
        overflow: 'auto',
        bgcolor: 'background.paper',
        '& .MuiListItem-root': {
          transition: 'background-color 0.2s ease'
        }
      }}
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <ListItem
              sx={{
                ...getNotificationStyle(notification.priority),
                opacity: notification.read ? 0.7 : 1
              }}
            >
              <ListItemIcon>
                {getIcon(notification.type, notification.category)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="div">
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 0.5 }}
                    >
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true
                      })}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {!notification.read && (
                  <Tooltip title="Mark as read">
                    <IconButton
                      edge="end"
                      aria-label="mark as read"
                      onClick={() => onMarkAsRead(notification._id)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <MarkReadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(notification._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  );
};

export default NotificationList;
