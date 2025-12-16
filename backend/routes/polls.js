const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createPoll,
    getAllPolls,
    getUserPolls,
    votePoll,
    likePoll,
    unlikePoll,
    getPollDetails,
} = require('../controllers/pollController');

// Poll CRUD routes
router.post('/', protect, createPoll);
router.get('/', getAllPolls);
router.get('/user/:userId', getUserPolls);
router.get('/:pollId', getPollDetails);

// Poll interaction routes
router.post('/:pollId/vote', protect, votePoll);
router.post('/:pollId/like', protect, likePoll);
router.delete('/:pollId/unlike', protect, unlikePoll);

module.exports = router;
