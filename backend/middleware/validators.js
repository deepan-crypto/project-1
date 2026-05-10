const { body, validationResult } = require('express-validator');

/**
 * Centralized Validation Rules
 * Uses express-validator for input validation and sanitization
 */

// ─── Validation Result Handler ───────────────────────────────────────────────
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// ─── Email Validation ────────────────────────────────────────────────────────
const emailValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    handleValidationErrors,
];

// ─── OTP Send Validation ────────────────────────────────────────────────────
const otpSendValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('purpose')
        .optional()
        .isIn(['email_verification', 'password_reset', 'login', 'general'])
        .withMessage('Invalid OTP purpose'),
    handleValidationErrors,
];

// ─── OTP Verify Validation ──────────────────────────────────────────────────
const otpVerifyValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
        .isNumeric().withMessage('OTP must contain only numbers'),
    handleValidationErrors,
];

// ─── Contact Form Validation ─────────────────────────────────────────────────
const contactFormValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters')
        .escape(),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
    handleValidationErrors,
];

// ─── Welcome Email Validation ────────────────────────────────────────────────
const welcomeEmailValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('userName')
        .trim()
        .notEmpty().withMessage('User name is required')
        .isLength({ min: 1, max: 100 }).withMessage('User name must be between 1 and 100 characters')
        .escape(),
    handleValidationErrors,
];

module.exports = {
    handleValidationErrors,
    emailValidation,
    otpSendValidation,
    otpVerifyValidation,
    contactFormValidation,
    welcomeEmailValidation,
};
