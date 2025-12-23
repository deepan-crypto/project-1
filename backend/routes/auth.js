const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
const passport = require('../config/passportConfig');
const { authLimiter } = require('../middleware/rateLimiter');
>>>>>>> master
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
<<<<<<< HEAD
} = require('../controllers/authController');

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
=======
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
>>>>>>> master

module.exports = router;
