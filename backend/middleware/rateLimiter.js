const rateLimit = require('express-rate-limit');

// Rate limiter for auth routes (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for general API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for email/OTP routes (strict — prevent email abuse)
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 email requests per 15 min window
    message: {
        success: false,
        message: 'Too many email requests. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for contact form (moderate)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 contact form submissions per hour
    message: {
        success: false,
        message: 'Too many contact form submissions. Please try again in an hour.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, emailLimiter, contactLimiter };
