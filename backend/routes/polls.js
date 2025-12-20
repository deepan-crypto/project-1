const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/pollController');

// Poll CRUD routes
router.post('/', protect, createPoll);
router.get('/', optionalAuth, getAllPolls);
router.get('/user/:userId', optionalAuth, getUserPolls);
router.get('/user/:userId/voted', optionalAuth, getUserVotedPolls);
router.get('/:pollId', getPollDetails);
router.delete('/:pollId', protect, deletePoll);

// Poll interaction routes
router.post('/:pollId/vote', protect, votePoll);
router.post('/:pollId/like', protect, likePoll);
router.delete('/:pollId/unlike', protect, unlikePoll);
router.get('/:pollId/likes', getPollLikes);

module.exports = router;
