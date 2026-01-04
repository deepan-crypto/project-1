const mongoose = require('mongoose');

const reportedPollSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: [true, 'Report reason is required'],
        trim: true,
        maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

// Index for faster queries
reportedPollSchema.index({ status: 1, createdAt: -1 });
reportedPollSchema.index({ pollId: 1 });

module.exports = mongoose.model('ReportedPoll', reportedPollSchema);
