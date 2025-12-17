const Notification = require('../models/Notification');
const FollowRequest = require('../models/FollowRequest');

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'username fullName profilePicture')
            .populate('pollId', 'question')
            .populate('followRequestId');

        const formattedNotifications = notifications.map(notif => {
            const base = {
                id: notif._id,
                user: {
                    id: notif.senderId._id,
                    name: notif.senderId.fullName || notif.senderId.username,
                    username: notif.senderId.username,
                    avatar: notif.senderId.profilePicture,
                },
                action: notif.message,
                time: formatTimeAgo(notif.createdAt),
                read: notif.read,
                type: notif.type,
                createdAt: notif.createdAt,
            };

            // Add follow request data if applicable
            if (notif.type === 'follow_request' && notif.followRequestId) {
                base.followRequestId = notif.followRequestId._id;
                base.followRequestStatus = notif.followRequestId.status;
            }

            return base;
        });

        res.status(200).json({
            success: true,
            notifications: formattedNotifications,
            page,
            totalPages: Math.ceil(
                await Notification.countDocuments({ recipientId: req.user._id }) / limit
            ),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        // Verify ownership
        if (notification.recipientId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this notification');
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    }

    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    }

    return 'just now';
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
