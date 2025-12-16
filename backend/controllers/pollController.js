const Poll = require('../models/Poll');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private
const createPoll = async (req, res, next) => {
    try {
        const { question, options } = req.body;

        if (!question || !options || options.length < 2) {
            res.status(400);
            throw new Error('Poll must have a question and at least 2 options');
        }

        // Format options
        const formattedOptions = options.map(option => ({
            text: typeof option === 'string' ? option : option.text,
            emoji: typeof option === 'object' ? option.emoji : '',
            votes: [],
            voteCount: 0,
        }));

        const poll = await Poll.create({
            userId: req.user._id,
            question,
            options: formattedOptions,
        });

        // Populate user info
        await poll.populate('userId', 'username fullName profilePicture');

        res.status(201).json({
            success: true,
            message: 'Poll created successfully',
            poll,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all polls (feed)
// @route   GET /api/polls
// @access  Public
const getAllPolls = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const polls = await Poll.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username fullName profilePicture');

        // Add percentages and check if current user voted
        const pollsWithDetails = polls.map(poll => {
            const percentages = poll.calculatePercentages();
            const hasVoted = req.user
                ? poll.options.some(opt => opt.votes.includes(req.user._id))
                : false;

            return {
                id: poll._id,
                userId: poll.userId._id,
                user: {
                    name: poll.userId.username,
                    avatar: poll.userId.profilePicture,
                },
                question: poll.question,
                options: percentages.map((opt, idx) => ({
                    id: idx,
                    text: opt.text,
                    emoji: opt.emoji,
                    percentage: opt.percentage,
                })),
                likes: poll.likes.length,
                hasVoted,
                createdAt: poll.createdAt,
            };
        });

        res.status(200).json({
            success: true,
            polls: pollsWithDetails,
            page,
            totalPages: Math.ceil(await Poll.countDocuments() / limit),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's polls
// @route   GET /api/polls/user/:userId
// @access  Public
const getUserPolls = async (req, res, next) => {
    try {
        const polls = await Poll.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username fullName profilePicture');

        const pollsWithDetails = polls.map(poll => {
            const percentages = poll.calculatePercentages();
            const hasVoted = req.user
                ? poll.options.some(opt => opt.votes.includes(req.user._id))
                : false;

            return {
                id: poll._id,
                user: {
                    name: poll.userId.username,
                    avatar: poll.userId.profilePicture,
                },
                question: poll.question,
                options: percentages.map((opt, idx) => ({
                    id: idx,
                    text: opt.text,
                    emoji: opt.emoji,
                    percentage: opt.percentage,
                })),
                likes: poll.likes.length,
                hasVoted,
                createdAt: poll.createdAt,
            };
        });

        res.status(200).json({
            success: true,
            polls: pollsWithDetails,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:pollId/vote
// @access  Private
const votePoll = async (req, res, next) => {
    try {
        const { optionIndex } = req.body;
        const poll = await Poll.findById(req.params.pollId);

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        // Check if user already voted
        const alreadyVoted = poll.options.some(opt =>
            opt.votes.includes(req.user._id)
        );

        if (alreadyVoted) {
            res.status(400);
            throw new Error('You have already voted on this poll');
        }

        // Validate option index
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            res.status(400);
            throw new Error('Invalid option index');
        }

        // Add vote
        poll.options[optionIndex].votes.push(req.user._id);
        poll.options[optionIndex].voteCount += 1;
        await poll.save();

        // Create notification for poll owner
        if (poll.userId.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipientId: poll.userId,
                senderId: req.user._id,
                type: 'vote',
                pollId: poll._id,
                message: `${req.user.username} voted on your poll`,
            });
        }

        // Calculate percentages
        const percentages = poll.calculatePercentages();

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            options: percentages.map((opt, idx) => ({
                id: idx,
                text: opt.text,
                emoji: opt.emoji,
                percentage: opt.percentage,
            })),
            hasVoted: true,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like a poll
// @route   POST /api/polls/:pollId/like
// @access  Private
const likePoll = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId);

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        // Check if already liked
        if (poll.likes.includes(req.user._id)) {
            res.status(400);
            throw new Error('You have already liked this poll');
        }

        // Add like
        poll.likes.push(req.user._id);
        await poll.save();

        // Create notification for poll owner
        if (poll.userId.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipientId: poll.userId,
                senderId: req.user._id,
                type: 'like',
                pollId: poll._id,
                message: `${req.user.username} liked your poll`,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Poll liked successfully',
            likesCount: poll.likes.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Unlike a poll
// @route   DELETE /api/polls/:pollId/unlike
// @access  Private
const unlikePoll = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId);

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        // Check if liked
        if (!poll.likes.includes(req.user._id)) {
            res.status(400);
            throw new Error('You have not liked this poll');
        }

        // Remove like
        poll.likes = poll.likes.filter(
            id => id.toString() !== req.user._id.toString()
        );
        await poll.save();

        res.status(200).json({
            success: true,
            message: 'Poll unliked successfully',
            likesCount: poll.likes.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single poll details
// @route   GET /api/polls/:pollId
// @access  Public
const getPollDetails = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId)
            .populate('userId', 'username fullName profilePicture');

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        const percentages = poll.calculatePercentages();
        const hasVoted = req.user
            ? poll.options.some(opt => opt.votes.includes(req.user._id))
            : false;

        res.status(200).json({
            success: true,
            poll: {
                id: poll._id,
                user: {
                    name: poll.userId.username,
                    avatar: poll.userId.profilePicture,
                },
                question: poll.question,
                options: percentages.map((opt, idx) => ({
                    id: idx,
                    text: opt.text,
                    emoji: opt.emoji,
                    percentage: opt.percentage,
                })),
                likes: poll.likes.length,
                hasVoted,
                createdAt: poll.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:pollId
// @access  Private
const deletePoll = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId);

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        // Check if user owns the poll
        if (poll.userId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this poll');
        }

        // Delete the poll
        await poll.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Poll deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get users who liked a poll
// @route   GET /api/polls/:pollId/likes
// @access  Public
const getPollLikes = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId)
            .populate('likes', 'username fullName profilePicture');

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        const likedBy = poll.likes.map(user => ({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
        }));

        res.status(200).json({
            success: true,
            count: likedBy.length,
            users: likedBy,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPoll,
    getAllPolls,
    getUserPolls,
    votePoll,
    likePoll,
    unlikePoll,
    getPollDetails,
    deletePoll,
    getPollLikes,
};
