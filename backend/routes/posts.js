const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const uploadPost = require('../middleware/uploadPost');
const {
    createPost,
    getPosts,
    getUserPosts,
    likePost,
    deletePost,
} = require('../controllers/postController');

// Post routes
router.post('/', protect, uploadPost.single('image'), createPost);
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.post('/:id/like', protect, likePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
