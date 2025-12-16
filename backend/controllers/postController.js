const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
    try {
        const { caption } = req.body;

        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an image');
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Create post
        const post = await Post.create({
            userId: user._id,
            image: `/uploads/posts/${req.file.filename}`,
            caption: caption || '',
        });

        // Add post to user's posts array
        user.posts.push(post._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: {
                id: post._id,
                image: post.image,
                caption: post.caption,
                likes: post.likes.length,
                createdAt: post.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'username fullName profilePicture')
            .sort({ createdAt: -1 })
            .limit(50);

        const postsWithLikes = posts.map(post => ({
            id: post._id,
            image: post.image,
            caption: post.caption,
            likes: post.likes.length,
            liked: req.user ? post.likes.includes(req.user._id) : false,
            createdAt: post.createdAt,
            user: {
                id: post.userId._id,
                username: post.userId.username,
                fullName: post.userId.fullName,
                profilePicture: post.userId.profilePicture,
            },
        }));

        res.status(200).json({
            success: true,
            count: postsWithLikes.length,
            posts: postsWithLikes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .populate('userId', 'username fullName profilePicture')
            .sort({ createdAt: -1 });

        const postsWithLikes = posts.map(post => ({
            id: post._id,
            image: post.image,
            caption: post.caption,
            likes: post.likes.length,
            liked: req.user ? post.likes.includes(req.user._id) : false,
            createdAt: post.createdAt,
        }));

        res.status(200).json({
            success: true,
            count: postsWithLikes.length,
            posts: postsWithLikes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like/unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        const userId = req.user._id;
        const likeIndex = post.likes.indexOf(userId);

        // Toggle like
        if (likeIndex === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: likeIndex === -1 ? 'Post liked' : 'Post unliked',
            likes: post.likes.length,
            liked: likeIndex === -1,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        // Check if user owns the post
        if (post.userId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this post');
        }

        // Remove post from user's posts array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { posts: post._id }
        });

        // Delete the post
        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getUserPosts,
    likePost,
    deletePost,
};
