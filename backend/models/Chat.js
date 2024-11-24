const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        type: String,
        url: String,
        mimeType: String
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    messages: [messageSchema],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        unreadCount: {
            type: Map,
            of: Number,
            default: new Map()
        },
        lastActivity: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ property: 1 });
chatSchema.index({ booking: 1 });
chatSchema.index({ 'metadata.lastActivity': -1 });

module.exports = mongoose.model('Chat', chatSchema);
