const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

module.exports = (io) => {
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', (socket) => {
        console.log(`User connected: ${socket.user._id}`);
        
        // Join user's personal room for private messages
        socket.join(`user_${socket.user._id}`);
        
        // Handle joining specific chat rooms
        socket.on('join_chat', async (chatId) => {
            try {
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    socket.emit('error', { message: 'Chat not found' });
                    return;
                }

                // Verify user is a participant
                if (!chat.participants.includes(socket.user._id)) {
                    socket.emit('error', { message: 'Not authorized to join this chat' });
                    return;
                }

                socket.join(`chat_${chatId}`);
                socket.emit('joined_chat', { chatId });

                // Mark messages as read when joining chat
                await Message.updateMany(
                    {
                        chat: chatId,
                        sender: { $ne: socket.user._id },
                        'readBy.user': { $ne: socket.user._id }
                    },
                    {
                        $push: {
                            readBy: {
                                user: socket.user._id,
                                readAt: new Date()
                            }
                        }
                    }
                );
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { chatId, content, type = 'text', attachments = [] } = data;

                const chat = await Chat.findById(chatId);
                if (!chat) {
                    socket.emit('error', { message: 'Chat not found' });
                    return;
                }

                // Create new message
                const message = await Message.create({
                    chat: chatId,
                    sender: socket.user._id,
                    content,
                    type,
                    attachments,
                    readBy: [{ user: socket.user._id, readAt: new Date() }]
                });

                // Update chat's last message and activity
                chat.lastMessage = message._id;
                chat.metadata.lastActivity = new Date();
                
                // Update unread counts for other participants
                chat.participants.forEach(participantId => {
                    if (participantId.toString() !== socket.user._id.toString()) {
                        const currentCount = chat.metadata.unreadCount.get(participantId.toString()) || 0;
                        chat.metadata.unreadCount.set(participantId.toString(), currentCount + 1);
                    }
                });
                
                await chat.save();

                // Populate message with sender details
                await message.populate('sender', 'name avatar');

                // Emit message to all users in the chat room
                chatNamespace.to(`chat_${chatId}`).emit('new_message', message);

                // Create notifications for other participants
                const otherParticipants = chat.participants.filter(
                    p => p.toString() !== socket.user._id.toString()
                );

                if (otherParticipants.length > 0) {
                    const notification = await Notification.create({
                        recipients: otherParticipants,
                        type: 'message',
                        title: `New message from ${socket.user.name}`,
                        message: content.substring(0, 100),
                        data: {
                            chatId,
                            messageId: message._id
                        }
                    });

                    // Emit notification to other participants
                    otherParticipants.forEach(participantId => {
                        chatNamespace.to(`user_${participantId}`).emit('notification', notification);
                    });
                }
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Handle typing status
        socket.on('typing_start', (chatId) => {
            socket.to(`chat_${chatId}`).emit('user_typing', {
                chatId,
                user: socket.user._id
            });
        });

        socket.on('typing_end', (chatId) => {
            socket.to(`chat_${chatId}`).emit('user_stopped_typing', {
                chatId,
                user: socket.user._id
            });
        });

        // Handle marking messages as read
        socket.on('mark_read', async (data) => {
            try {
                const { chatId, messageIds } = data;

                await Message.updateMany(
                    {
                        _id: { $in: messageIds },
                        chat: chatId,
                        'readBy.user': { $ne: socket.user._id }
                    },
                    {
                        $push: {
                            readBy: {
                                user: socket.user._id,
                                readAt: new Date()
                            }
                        }
                    }
                );

                // Reset unread count for this user in the chat
                const chat = await Chat.findById(chatId);
                if (chat) {
                    chat.metadata.unreadCount.set(socket.user._id.toString(), 0);
                    await chat.save();
                }

                // Emit read status to other users in chat
                socket.to(`chat_${chatId}`).emit('messages_read', {
                    chatId,
                    messageIds,
                    userId: socket.user._id
                });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user._id}`);
        });
    });
};
