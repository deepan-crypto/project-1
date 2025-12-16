const User = require('../models/User');
const Poll = require('../models/Poll');
const Notification = require('../models/Notification');

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

        // Add to following and followers
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
};
