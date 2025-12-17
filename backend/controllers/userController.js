const User = require('../models/User');
const Poll = require('../models/Poll');
const Notification = require('../models/Notification');
const FollowRequest = require('../models/FollowRequest');

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:userId
// @access  Public
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Get user's polls
        const polls = await Poll.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followersCount: user.followers.length,
                followingCount: user.following.length,
            },
            polls,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current authenticated user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                followersCount: user.followers.length,
                followingCount: user.following.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, username, bio } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Validate fullName if provided (no numbers allowed)
        if (fullName !== undefined && fullName.trim()) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(fullName.trim())) {
                res.status(400);
                throw new Error('Name can only contain letters and spaces, no numbers allowed');
            }
            user.fullName = fullName.trim();
        }

        // Validate and update username if provided
        if (username !== undefined && username.trim()) {
            // Check minimum length
            if (username.length < 3) {
                res.status(400);
                throw new Error('Username must be at least 3 characters long');
            }

            // Check if username is different from current
            if (username !== user.username) {
                // Check if new username already exists
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    res.status(400);
                    throw new Error('This username is already taken. Please choose a different username.');
                }
                user.username = username;
            }
        }

        // Update bio (can be empty string)
        if (bio !== undefined) {
            user.bio = bio;
        }

        // Handle profile picture upload if file is provided
        if (req.file) {
            user.profilePicture = `/uploads/avatars/${req.file.filename}`;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an image file');
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update profile picture path
        user.profilePicture = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        next(error);
    }
};

const followUser = async (req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            res.status(404);
            throw new Error('User not found');
        }

        // Can't follow yourself
        if (userToFollow._id.toString() === currentUser._id.toString()) {
            res.status(400);
            throw new Error('You cannot follow yourself');
        }

        // Check if already following
        if (currentUser.following.includes(userToFollow._id)) {
            res.status(400);
            throw new Error('You are already following this user');
        }

        // If user is private, create a follow request instead
        if (userToFollow.isPrivate) {
            // Check if request already exists
            const existingRequest = await FollowRequest.findOne({
                senderId: currentUser._id,
                recipientId: userToFollow._id,
                status: 'pending',
            });

            if (existingRequest) {
                res.status(400);
                throw new Error('Follow request already sent');
            }

            // Create follow request
            const followRequest = await FollowRequest.create({
                senderId: currentUser._id,
                recipientId: userToFollow._id,
            });

            // Create notification
            await Notification.create({
                recipientId: userToFollow._id,
                senderId: currentUser._id,
                type: 'follow_request',
                message: `${currentUser.username} wants to follow you`,
                followRequestId: followRequest._id,
            });

            return res.status(200).json({
                success: true,
                message: 'Follow request sent',
                requestSent: true,
            });
        }

        // Add to following and followers (public profile)
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        // Create notification
        await Notification.create({
            recipientId: userToFollow._id,
            senderId: currentUser._id,
            type: 'follow',
            message: `${currentUser.username} started following you`,
        });

        res.status(200).json({
            success: true,
            message: 'User followed successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:userId/unfollow
// @access  Private
const unfollowUser = async (req, res, next) => {
    try {
        const userToUnfollow = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if following
        if (!currentUser.following.includes(userToUnfollow._id)) {
            res.status(400);
            throw new Error('You are not following this user');
        }

        // Remove from following and followers
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToUnfollow._id.toString()
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            success: true,
            message: 'User unfollowed successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's followers
// @route   GET /api/users/:userId/followers
// @access  Public
const getFollowers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).populate(
            'followers',
            'username fullName profilePicture'
        );

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            followers: user.followers,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's following
// @route   GET /api/users/:userId/following
// @access  Public
const getFollowing = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).populate(
            'following',
            'username fullName profilePicture'
        );

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            following: user.following,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/users/:userId/stats
// @access  Public
const getUserStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const pollCount = await Poll.countDocuments({ userId: user._id });

        res.status(200).json({
            success: true,
            stats: {
                followersCount: user.followers.length,
                followingCount: user.following.length,
                pollCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile by username
// @route   GET /api/users/username/:username
// @access  Public
const getUserByUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followers: user.followers,
                following: user.following,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search users by username or full name
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({
                success: true,
                users: [],
            });
        }

        const searchRegex = new RegExp(q.trim(), 'i');

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } }, // Exclude current user
                {
                    $or: [
                        { username: searchRegex },
                        { fullName: searchRegex },
                    ],
                },
            ],
        })
            .select('_id fullName username profilePicture isPrivate')
            .limit(20);

        // Get follow status for each user
        const currentUser = await User.findById(req.user._id);
        const pendingRequests = await FollowRequest.find({
            senderId: req.user._id,
            status: 'pending',
        });
        const pendingRecipientIds = pendingRequests.map(r => r.recipientId.toString());

        const usersWithStatus = users.map(user => ({
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePicture: user.profilePicture,
            isPrivate: user.isPrivate,
            isFollowing: currentUser.following.includes(user._id),
            hasPendingRequest: pendingRecipientIds.includes(user._id.toString()),
        }));

        res.status(200).json({
            success: true,
            users: usersWithStatus,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send follow request to private profile
// @route   POST /api/users/follow-request/:userId
// @access  Private
const sendFollowRequest = async (req, res, next) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!targetUser) {
            res.status(404);
            throw new Error('User not found');
        }

        if (targetUser._id.toString() === currentUser._id.toString()) {
            res.status(400);
            throw new Error('You cannot send a follow request to yourself');
        }

        // Check if already following
        if (currentUser.following.includes(targetUser._id)) {
            res.status(400);
            throw new Error('You are already following this user');
        }

        // Check if request already exists
        const existingRequest = await FollowRequest.findOne({
            senderId: currentUser._id,
            recipientId: targetUser._id,
            status: 'pending',
        });

        if (existingRequest) {
            res.status(400);
            throw new Error('Follow request already sent');
        }

        // Create follow request
        const followRequest = await FollowRequest.create({
            senderId: currentUser._id,
            recipientId: targetUser._id,
        });

        // Create notification
        await Notification.create({
            recipientId: targetUser._id,
            senderId: currentUser._id,
            type: 'follow_request',
            message: `${currentUser.username} wants to follow you`,
            followRequestId: followRequest._id,
        });

        res.status(200).json({
            success: true,
            message: 'Follow request sent',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Accept follow request
// @route   PUT /api/users/follow-request/:requestId/accept
// @access  Private
const acceptFollowRequest = async (req, res, next) => {
    try {
        const followRequest = await FollowRequest.findById(req.params.requestId);

        if (!followRequest) {
            res.status(404);
            throw new Error('Follow request not found');
        }

        // Verify recipient is current user
        if (followRequest.recipientId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to accept this request');
        }

        if (followRequest.status !== 'pending') {
            res.status(400);
            throw new Error('This request has already been processed');
        }

        // Update request status
        followRequest.status = 'accepted';
        await followRequest.save();

        // Add to following/followers
        const sender = await User.findById(followRequest.senderId);
        const recipient = await User.findById(followRequest.recipientId);

        if (!sender.following.includes(recipient._id)) {
            sender.following.push(recipient._id);
            await sender.save();
        }

        if (!recipient.followers.includes(sender._id)) {
            recipient.followers.push(sender._id);
            await recipient.save();
        }

        // Create notification for sender
        await Notification.create({
            recipientId: sender._id,
            senderId: recipient._id,
            type: 'follow',
            message: `${recipient.username} accepted your follow request`,
        });

        res.status(200).json({
            success: true,
            message: 'Follow request accepted',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject follow request
// @route   PUT /api/users/follow-request/:requestId/reject
// @access  Private
const rejectFollowRequest = async (req, res, next) => {
    try {
        const followRequest = await FollowRequest.findById(req.params.requestId);

        if (!followRequest) {
            res.status(404);
            throw new Error('Follow request not found');
        }

        // Verify recipient is current user
        if (followRequest.recipientId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to reject this request');
        }

        if (followRequest.status !== 'pending') {
            res.status(400);
            throw new Error('This request has already been processed');
        }

        // Update request status
        followRequest.status = 'rejected';
        await followRequest.save();

        res.status(200).json({
            success: true,
            message: 'Follow request rejected',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending follow requests for current user
// @route   GET /api/users/follow-requests
// @access  Private
const getFollowRequests = async (req, res, next) => {
    try {
        const requests = await FollowRequest.find({
            recipientId: req.user._id,
            status: 'pending',
        })
            .populate('senderId', 'username fullName profilePicture')
            .sort({ createdAt: -1 });

        const formattedRequests = requests.map(request => ({
            id: request._id,
            user: {
                id: request.senderId._id,
                fullName: request.senderId.fullName,
                username: request.senderId.username,
                profilePicture: request.senderId.profilePicture,
            },
            createdAt: request.createdAt,
        }));

        res.status(200).json({
            success: true,
            requests: formattedRequests,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update privacy settings
// @route   PUT /api/users/settings/privacy
// @access  Private
const updatePrivacySettings = async (req, res, next) => {
    try {
        const { isPrivate } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.isPrivate = Boolean(isPrivate);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Privacy settings updated',
            isPrivate: user.isPrivate,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
const getSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('isPrivate');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            settings: {
                isPrivate: user.isPrivate,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserProfile,
    getCurrentUser,
    updateProfile,
    uploadAvatar,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUserStats,
    getUserByUsername,
    searchUsers,
    sendFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    getFollowRequests,
    updatePrivacySettings,
    getSettings,
};
