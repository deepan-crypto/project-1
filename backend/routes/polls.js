const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
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
    reportPoll,
    getReportedPolls,
    deleteReportedPoll,
    dismissReport,
    getAllPollsAdmin,
    deletePollByIdAdmin,
} = require('../controllers/pollController');

// Poll CRUD routes
router.post('/', protect, createPoll);
router.get('/', optionalAuth, getAllPolls);
router.get('/user/:userId', optionalAuth, getUserPolls);
router.get('/user/:userId/voted', optionalAuth, getUserVotedPolls);

// Admin routes for managing reports and polls (must come before /:pollId to avoid matching as pollId)
router.get('/reports/all', isAdmin, getReportedPolls);
router.delete('/reports/:reportId', isAdmin, deleteReportedPoll);
router.put('/reports/:reportId/dismiss', isAdmin, dismissReport);

// Admin routes for polls
router.get('/admin/all', isAdmin, getAllPollsAdmin);
router.delete('/admin/:pollId', isAdmin, deletePollByIdAdmin);

// Poll detail and deletion (generic dynamic route comes after specific routes)
router.get('/:pollId', getPollDetails);
router.delete('/:pollId', protect, deletePoll);

// Poll interaction routes
router.post('/:pollId/vote', protect, votePoll);
router.post('/:pollId/like', protect, likePoll);
router.delete('/:pollId/unlike', protect, unlikePoll);
router.get('/:pollId/likes', getPollLikes);

// Poll reporting routes
router.post('/:pollId/report', protect, reportPoll);

module.exports = router;
