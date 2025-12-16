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
} = require('../controllers/userController');

// User profile routes
router.get('/me', protect, getCurrentUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// Follow/unfollow routes
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/unfollow', protect, unfollowUser);

// Followers/following routes
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/stats', getUserStats);

module.exports = router;
