const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    question: {
        type: String,
        required: [true, 'Poll question is required'],
        trim: true,
        maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    options: [{
        text: {
            type: String,
            required: true,
            trim: true,
        },
        emoji: {
            type: String,
            default: '',
        },
        votes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        voteCount: {
            type: Number,
            default: 0,
        },
    }],
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    totalVotes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Calculate vote percentages
pollSchema.methods.calculatePercentages = function () {
    const total = this.totalVotes || 0;

    return this.options.map(option => ({
        text: option.text,
        emoji: option.emoji,
        voteCount: option.voteCount,
        percentage: total > 0 ? Math.round((option.voteCount / total) * 100) : 0,
    }));
};

// Update total votes before saving
pollSchema.pre('save', function (next) {
    this.totalVotes = this.options.reduce((sum, option) => sum + option.voteCount, 0);
    next();
});

module.exports = mongoose.model('Poll', pollSchema);
