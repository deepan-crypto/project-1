const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    googleCallback,
} = require('../controllers/authController');

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/auth/login?error=oauth_failed',
    }),
    googleCallback
);

module.exports = router;
