const mongoose = require('mongoose');

const followRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

// Index for faster queries
followRequestSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });
followRequestSchema.index({ recipientId: 1, status: 1 });

module.exports = mongoose.model('FollowRequest', followRequestSchema);
