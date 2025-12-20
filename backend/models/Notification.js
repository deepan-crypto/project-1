const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'vote', 'follow', 'comment', 'follow_request'],
        required: true,
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
    },
    followRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FollowRequest',
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Index for faster queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
