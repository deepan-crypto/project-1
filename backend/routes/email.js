const express = require('express');
const router = express.Router();
const { emailLimiter, contactLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');
const {
    otpSendValidation,
    otpVerifyValidation,
    contactFormValidation,
    welcomeEmailValidation,
} = require('../middleware/validators');
const {
    sendOtp,
    verifyOtp,
    sendWelcomeEmailHandler,
    handleContactForm,
} = require('../controllers/emailController');

/**
 * Email Routes
 * All email-related API endpoints
 *
 * POST /api/email/send-otp     - Send OTP to email (public, rate-limited)
 * POST /api/email/verify-otp   - Verify an OTP (public, rate-limited)
 * POST /api/email/welcome      - Send welcome email (protected)
 * POST /api/email/contact      - Contact form submission (public, rate-limited)
 */

// OTP routes — strict rate limiting
router.post('/send-otp', emailLimiter, otpSendValidation, sendOtp);
router.post('/verify-otp', emailLimiter, otpVerifyValidation, verifyOtp);

// Welcome email — requires authentication
router.post('/welcome', protect, welcomeEmailValidation, sendWelcomeEmailHandler);

// Contact form — moderate rate limiting
router.post('/contact', contactLimiter, contactFormValidation, handleContactForm);

module.exports = router;
