const Poll = require('../models/Poll');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ReportedPoll = require('../models/ReportedPoll');
const { emitNotification, emitNotificationUpdate } = require('../utils/socketEmitter');
const { sendPushNotification } = require('../utils/pushNotificationService');

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
// @access  Public (but filters private profile polls)
const getAllPolls = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all polls and populate user info including isPrivate and followers
        const polls = await Poll.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username fullName profilePicture isPrivate followers');

        // Filter polls: show only if profile is public OR user is follower OR user is owner
        const currentUserId = req.user?._id?.toString();

        const filteredPolls = polls.filter(poll => {
            const pollOwner = poll.userId;

            // If profile is not private, show poll
            if (!pollOwner.isPrivate) {
                return true;
            }

            // If current user is the poll owner, show poll
            if (currentUserId && pollOwner._id.toString() === currentUserId) {
                return true;
            }

            // If current user is a follower, show poll
            if (currentUserId && pollOwner.followers) {
                const isFollower = pollOwner.followers.some(
                    followerId => followerId.toString() === currentUserId
                );
                if (isFollower) {
                    return true;
                }
            }

            // Private profile and not a follower, hide poll
            return false;
        });

        // Add percentages and check if current user voted
        const pollsWithDetails = filteredPolls.map(poll => {
            const percentages = poll.calculatePercentages();
            const hasVoted = req.user
                ? poll.options.some(opt => opt.votes.some(v => v.toString() === req.user._id.toString()))
                : false;
            const isLiked = req.user
                ? poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())
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
                isLiked,
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
// @access  Public (but respects privacy settings)
const getUserPolls = async (req, res, next) => {
    try {
        // Get the profile owner
        const profileOwner = await User.findById(req.params.userId);

        if (!profileOwner) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if profile is private and if current user has access
        if (profileOwner.isPrivate) {
            // If not authenticated, deny access
            if (!req.user) {
                return res.status(200).json({
                    success: true,
                    polls: [],
                    isPrivate: true,
                    message: 'This account is private',
                });
            }

            // If it's the profile owner themselves, allow access
            const isOwner = req.user._id.toString() === profileOwner._id.toString();

            // Check if current user is a follower
            const isFollower = profileOwner.followers.some(
                followerId => followerId.toString() === req.user._id.toString()
            );

            // If not owner and not follower, deny access
            if (!isOwner && !isFollower) {
                return res.status(200).json({
                    success: true,
                    polls: [],
                    isPrivate: true,
                    message: 'This account is private. Follow to see their polls.',
                });
            }
        }

        const polls = await Poll.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username fullName profilePicture');

        const pollsWithDetails = polls.map(poll => {
            const percentages = poll.calculatePercentages();
            const hasVoted = req.user
                ? poll.options.some(opt => opt.votes.some(v => v.toString() === req.user._id.toString()))
                : false;
            const isLiked = req.user
                ? poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())
                : false;

            // Find which option the user voted for
            let votedOptionIndex = -1;
            if (req.user && hasVoted) {
                votedOptionIndex = poll.options.findIndex(opt =>
                    opt.votes.some(v => v.toString() === req.user._id.toString())
                );
            }

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
                isLiked,
                votedOptionIndex: votedOptionIndex >= 0 ? votedOptionIndex : undefined,
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

// @desc    Get polls that user has voted on
// @route   GET /api/polls/user/:userId/voted
// @access  Public (but respects privacy settings)
const getUserVotedPolls = async (req, res, next) => {
    try {
        const targetUserId = req.params.userId;

        // Find all polls where any option's votes array contains the user's ID
        const polls = await Poll.find({
            'options.votes': targetUserId
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'username fullName profilePicture isPrivate followers');

        // Filter polls based on privacy settings
        const currentUserId = req.user?._id?.toString();

        const filteredPolls = polls.filter(poll => {
            const pollOwner = poll.userId;

            // If profile is not private, show poll
            if (!pollOwner.isPrivate) {
                return true;
            }

            // If current user is the poll owner, show poll
            if (currentUserId && pollOwner._id.toString() === currentUserId) {
                return true;
            }

            // If current user is a follower, show poll
            if (currentUserId && pollOwner.followers) {
                const isFollower = pollOwner.followers.some(
                    followerId => followerId.toString() === currentUserId
                );
                if (isFollower) {
                    return true;
                }
            }

            // Private profile and not a follower, hide poll
            return false;
        });

        const pollsWithDetails = filteredPolls.map(poll => {
            const percentages = poll.calculatePercentages();
            const hasVoted = req.user
                ? poll.options.some(opt => opt.votes.some(v => v.toString() === req.user._id.toString()))
                : poll.options.some(opt => opt.votes.some(v => v.toString() === targetUserId));
            const isLiked = req.user
                ? poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())
                : false;

            // Find which option the user voted for
            let votedOptionIndex = -1;
            if (hasVoted) {
                const userId = req.user ? req.user._id.toString() : targetUserId;
                votedOptionIndex = poll.options.findIndex(opt =>
                    opt.votes.some(v => v.toString() === userId)
                );
            }

            return {
                id: poll._id,
                userId: poll.userId._id,
                user: {
                    name: poll.userId.username,
                    fullName: poll.userId.fullName,
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
                isLiked,
                votedOptionIndex: votedOptionIndex >= 0 ? votedOptionIndex : undefined,
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

        // Validate option index
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            res.status(400);
            throw new Error('Invalid option index');
        }

        // Check if user already voted and on which option
        let previousVoteIndex = -1;
        poll.options.forEach((opt, idx) => {
            const userVoteIndex = opt.votes.findIndex(
                vote => vote.toString() === req.user._id.toString()
            );
            if (userVoteIndex !== -1) {
                previousVoteIndex = idx;
                // Remove the old vote
                opt.votes.splice(userVoteIndex, 1);
                opt.voteCount = Math.max(0, opt.voteCount - 1);
            }
        });

        // Add new vote
        poll.options[optionIndex].votes.push(req.user._id);
        poll.options[optionIndex].voteCount += 1;

        // Clean up any invalid likes (likes without userId) before saving
        poll.likes = poll.likes.filter(like => like.userId);

        await poll.save();

        // Create notification for poll owner (only if first time voting)
        if (previousVoteIndex === -1 && poll.userId.toString() !== req.user._id.toString()) {
            const notification = await Notification.create({
                recipientId: poll.userId,
                senderId: req.user._id,
                type: 'vote',
                pollId: poll._id,
                message: `${req.user.username} voted on your poll`,
            });

            // Emit real-time notification to poll owner
            emitNotification(poll.userId, {
                id: notification._id,
                user: {
                    id: req.user._id,
                    name: req.user.fullName || req.user.username,
                    username: req.user.username,
                    avatar: req.user.profilePicture,
                },
                action: 'voted on your poll',
                time: 'Just now',
                read: false,
                type: 'vote',
                pollId: poll._id,
            });

            // Send push notification
            try {
                await sendPushNotification(
                    poll.userId,
                    'New Vote',
                    `${req.user.username} voted on your poll`,
                    {
                        type: 'poll_vote',
                        pollId: poll._id.toString(),
                        senderId: req.user._id.toString(),
                    }
                );
            } catch (error) {
                console.error('Error sending push notification:', error);
                // Don't fail the request if push notification fails
            }
        }

        // Emit vote update to all users viewing this poll
        if (global.io) {
            global.io.emit('poll_vote_update', {
                pollId: poll._id,
                options: poll.calculatePercentages().map((opt, idx) => ({
                    id: idx,
                    text: opt.text,
                    emoji: opt.emoji,
                    percentage: opt.percentage,
                })),
            });
        }

        // Calculate percentages for ALL options
        const percentages = poll.calculatePercentages();

        res.status(200).json({
            success: true,
            message: previousVoteIndex === -1 ? 'Vote recorded successfully' : 'Vote changed successfully',
            options: percentages.map((opt, idx) => ({
                id: idx,
                text: opt.text,
                emoji: opt.emoji,
                percentage: opt.percentage,
            })),
            hasVoted: true,
            votedOptionIndex: optionIndex,
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
        if (poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())) {
            res.status(400);
            throw new Error('You have already liked this poll');
        }

        // Add like
        poll.likes.push({
            userId: req.user._id,
            likedAt: new Date(),
        });

        // Clean up any invalid likes (likes without userId) before saving
        poll.likes = poll.likes.filter(like => like.userId);

        await poll.save();

        // Create notification for poll owner
        if (poll.userId.toString() !== req.user._id.toString()) {
            const notification = await Notification.create({
                recipientId: poll.userId,
                senderId: req.user._id,
                type: 'like',
                pollId: poll._id,
                message: `${req.user.username} liked your poll`,
            });

            // Emit real-time notification to poll owner
            emitNotification(poll.userId, {
                id: notification._id,
                user: {
                    id: req.user._id,
                    name: req.user.fullName || req.user.username,
                    username: req.user.username,
                    avatar: req.user.profilePicture,
                },
                action: 'liked your poll',
                time: 'Just now',
                read: false,
                type: 'like',
                pollId: poll._id,
            });

            // Send push notification
            try {
                await sendPushNotification(
                    poll.userId,
                    'New Like',
                    `${req.user.username} liked your poll`,
                    {
                        type: 'poll_like',
                        pollId: poll._id.toString(),
                        senderId: req.user._id.toString(),
                    }
                );
            } catch (error) {
                console.error('Error sending push notification:', error);
                // Don't fail the request if push notification fails
            }
        }

        // Emit like count update to all users viewing this poll
        if (global.io) {
            global.io.emit('poll_like_update', {
                pollId: poll._id,
                likesCount: poll.likes.length,
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
        if (!poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())) {
            res.status(400);
            throw new Error('You have not liked this poll');
        }

        // Remove like
        poll.likes = poll.likes.filter(
            like => like.userId && like.userId.toString() !== req.user._id.toString()
        );
        await poll.save();

        // Emit like count update to all users viewing this poll
        if (global.io) {
            global.io.emit('poll_like_update', {
                pollId: poll._id,
                likesCount: poll.likes.length,
            });
        }

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
            ? poll.options.some(opt => opt.votes.some(v => v.toString() === req.user._id.toString()))
            : false;
        const isLiked = req.user
            ? poll.likes.some(like => like.userId && like.userId.toString() === req.user._id.toString())
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
                isLiked,
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
            .populate('likes.userId', 'username fullName profilePicture');

        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        const likedBy = poll.likes.map(like => ({
            id: like.userId._id,
            username: like.userId.username,
            fullName: like.userId.fullName,
            profilePicture: like.userId.profilePicture,
            likedAt: like.likedAt,
        }));

        // Sort by most recent first
        likedBy.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));

        res.status(200).json({
            success: true,
            count: likedBy.length,
            users: likedBy,
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Report a poll
// @route   POST /api/polls/:pollId/report
// @access  Private
const reportPoll = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const pollId = req.params.pollId;

        if (!reason || reason.trim().length === 0) {
            res.status(400);
            throw new Error('Report reason is required');
        }

        // Check if poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404);
            throw new Error('Poll not found');
        }

        // Check if user already reported this poll
        const existingReport = await ReportedPoll.findOne({
            pollId: pollId,
            reportedBy: req.user._id,
            status: 'pending',
        });

        if (existingReport) {
            res.status(400);
            throw new Error('You have already reported this poll');
        }

        // Create report
        const report = await ReportedPoll.create({
            pollId: pollId,
            reportedBy: req.user._id,
            reason: reason.trim(),
        });

        res.status(201).json({
            success: true,
            message: 'Poll reported successfully. Our team will review it.',
            report,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reported polls (Admin only)
// @route   GET /api/polls/reports
// @access  Private/Admin
const getReportedPolls = async (req, res, next) => {
    try {
        const reports = await ReportedPoll.find({ status: 'pending' })
            .populate('pollId', 'question options userId createdAt')
            .populate('reportedBy', 'username email profilePicture')
            .sort({ createdAt: -1 });

        // Populate the poll owner info
        const reportsWithOwner = await Promise.all(
            reports.map(async (report) => {
                if (report.pollId) {
                    await report.pollId.populate('userId', 'username email profilePicture');
                }
                return report;
            })
        );

        res.status(200).json({
            success: true,
            count: reportsWithOwner.length,
            reports: reportsWithOwner,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a reported poll (Admin only)
// @route   DELETE /api/polls/reports/:reportId
// @access  Private/Admin
const deleteReportedPoll = async (req, res, next) => {
    try {
        const report = await ReportedPoll.findById(req.params.reportId);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        // Delete the poll
        await Poll.findByIdAndDelete(report.pollId);

        // Mark report as resolved
        report.status = 'resolved';
        await report.save();

        res.status(200).json({
            success: true,
            message: 'Poll deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Dismiss a report without deleting poll (Admin only)
// @route   PUT /api/polls/reports/:reportId/dismiss
// @access  Private/Admin
const dismissReport = async (req, res, next) => {
    try {
        const report = await ReportedPoll.findById(req.params.reportId);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        // Mark report as resolved
        report.status = 'resolved';
        await report.save();

        res.status(200).json({
            success: true,
            message: 'Report dismissed successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPoll,
    getAllPolls,
    getUserPolls,
    getUserVotedPolls,
    votePoll,
    likePoll,
    unlikePoll,
    getPollDetails,
    deletePoll,
    getPollLikes,
    reportPoll,
    getReportedPolls,
    deleteReportedPoll,
    dismissReport,
};
