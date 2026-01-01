const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
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
    registerPushToken,
    changePassword,
    deleteAccount,
} = require('../controllers/userController');

// User search
router.get('/search', protect, searchUsers);

// User profile routes
router.get('/me', protect, getCurrentUser);
router.get('/profile/:userId', getUserProfile);
router.get('/username/:username', getUserByUsername);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// Settings routes
router.get('/settings', protect, getSettings);
router.put('/settings/privacy', protect, updatePrivacySettings);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

// Push notification routes
router.post('/register-push-token', protect, registerPushToken);

// Follow request routes
router.get('/follow-requests', protect, getFollowRequests);
router.post('/follow-request/:userId', protect, sendFollowRequest);
router.put('/follow-request/:requestId/accept', protect, acceptFollowRequest);
router.put('/follow-request/:requestId/reject', protect, rejectFollowRequest);

// Follow/unfollow routes
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/unfollow', protect, unfollowUser);

// Followers/following routes
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/stats', getUserStats);

module.exports = router;
