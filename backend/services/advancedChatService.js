const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Group = require('../models/Group');
const cloudinary = require('cloudinary').v2;

class AdvancedChatService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    // Handle file upload for chat messages
    async handleFileUpload(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                folder: 'chat_attachments'
            });

            return {
                url: result.secure_url,
                type: result.resource_type,
                format: result.format,
                size: result.bytes
            };
        } catch (error) {
            console.error('File upload error:', error);
            throw new Error('Failed to upload file');
        }
    }

    // Send message with attachments
    async sendMessageWithAttachments(senderId, receiverId, content, attachments) {
        try {
            const uploadedFiles = await Promise.all(
                attachments.map(file => this.handleFileUpload(file))
            );

            const message = await Message.create({
                sender: senderId,
                receiver: receiverId,
                content,
                attachments: uploadedFiles,
                timestamp: new Date()
            });

            return message;
        } catch (error) {
            console.error('Send message error:', error);
            throw new Error('Failed to send message with attachments');
        }
    }

    // Create group chat with rich media support
    async createGroupChat(name, description, creatorId, members, avatar) {
        try {
            let avatarUrl = null;
            if (avatar) {
                const uploadResult = await cloudinary.uploader.upload(avatar.path, {
                    folder: 'group_avatars'
                });
                avatarUrl = uploadResult.secure_url;
            }

            const group = await Group.create({
                name,
                description,
                creator: creatorId,
                members: [creatorId, ...members],
                avatar: avatarUrl,
                createdAt: new Date()
            });

            return group;
        } catch (error) {
            console.error('Create group error:', error);
            throw new Error('Failed to create group chat');
        }
    }

    // Get chat history with media
    async getChatHistory(userId, chatId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const messages = await Message.find({
                $or: [
                    { sender: userId, receiver: chatId },
                    { sender: chatId, receiver: userId }
                ]
            })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sender', 'name avatar')
                .populate('receiver', 'name avatar');

            return messages;
        } catch (error) {
            console.error('Get chat history error:', error);
            throw new Error('Failed to get chat history');
        }
    }

    // Get group chat details with media
    async getGroupChatDetails(groupId) {
        try {
            const group = await Group.findById(groupId)
                .populate('creator', 'name avatar')
                .populate('members', 'name avatar')
                .populate({
                    path: 'messages',
                    options: { sort: { timestamp: -1 }, limit: 50 },
                    populate: { path: 'sender', select: 'name avatar' }
                });

            return group;
        } catch (error) {
            console.error('Get group details error:', error);
            throw new Error('Failed to get group chat details');
        }
    }

    // Search messages with advanced filters
    async searchMessages(userId, query, filters = {}) {
        try {
            const searchCriteria = {
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            };

            if (query) {
                searchCriteria.content = { $regex: query, $options: 'i' };
            }

            if (filters.hasAttachments) {
                searchCriteria['attachments.0'] = { $exists: true };
            }

            if (filters.dateRange) {
                searchCriteria.timestamp = {
                    $gte: filters.dateRange.start,
                    $lte: filters.dateRange.end
                };
            }

            const messages = await Message.find(searchCriteria)
                .sort({ timestamp: -1 })
                .populate('sender', 'name avatar')
                .populate('receiver', 'name avatar');

            return messages;
        } catch (error) {
            console.error('Search messages error:', error);
            throw new Error('Failed to search messages');
        }
    }
}

module.exports = AdvancedChatService;