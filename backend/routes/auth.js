const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const { authLimiter } = require('../middleware/rateLimiter');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    googleCallback,
} = require('../controllers/authController');

// Authentication routes with rate limiting
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Google OAuth routes
// Web flow - opens browser
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

// Browser callback (used by web flow)
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/auth/login?error=oauth_failed',
    }),
    googleCallback
);

// Mobile flow - exchange auth code for token
router.post('/google/callback', googleCallback);

module.exports = router;
