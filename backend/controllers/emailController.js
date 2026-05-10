const Otp = require('../models/Otp');
const {
    sendOtpEmail,
    sendWelcomeEmail,
    sendContactFormEmail,
} = require('../utils/emailService');

/**
 * Email Controller
 * Handles OTP, welcome email, and contact form business logic
 */

// ─── Send OTP ────────────────────────────────────────────────────────────────

/**
 * @desc    Generate and send OTP to email
 * @route   POST /api/email/send-otp
 * @access  Public
 */
const sendOtp = async (req, res, next) => {
    try {
        const { email, purpose = 'general' } = req.body;

        // Rate-limit: prevent OTP spam — max 3 active OTPs per email
        const recentOtps = await Otp.countDocuments({
            email,
            createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // last 15 min
        });

        if (recentOtps >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please wait 15 minutes before trying again.',
            });
        }

        // Invalidate any existing unused OTPs for this email + purpose
        await Otp.deleteMany({ email, purpose, isUsed: false });

        // Generate OTP
        const otpCode = Otp.generateOtp();
        const expiryMinutes = 10;

        // Store OTP in database (hashed via pre-save hook)
        await Otp.create({
            email,
            otp: otpCode,
            purpose,
            expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
        });

        // Send OTP email via AWS SES
        const emailResult = await sendOtpEmail(email, otpCode, expiryMinutes);

        if (!emailResult.success) {
            console.error('Failed to send OTP email:', emailResult.error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again later.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
            data: {
                expiresIn: `${expiryMinutes} minutes`,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── Verify OTP ──────────────────────────────────────────────────────────────

/**
 * @desc    Verify an OTP
 * @route   POST /api/email/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Find the most recent unused OTP for this email
        const otpRecord = await Otp.findOne({
            email,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired or does not exist. Please request a new one.',
            });
        }

        // Check attempt limit (brute force protection)
        if (otpRecord.attempts >= 5) {
            // Delete the OTP — force user to request a new one
            await Otp.deleteOne({ _id: otpRecord._id });
            return res.status(429).json({
                success: false,
                message: 'Too many incorrect attempts. Please request a new OTP.',
            });
        }

        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save({ validateModifiedOnly: true });

        // Compare OTP
        const isValid = await otpRecord.compareOtp(otp);

        if (!isValid) {
            const remainingAttempts = 5 - otpRecord.attempts;
            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
            });
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save({ validateModifiedOnly: true });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: {
                email,
                purpose: otpRecord.purpose,
                verifiedAt: new Date(),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── Send Welcome Email ──────────────────────────────────────────────────────

/**
 * @desc    Manually trigger a welcome email
 * @route   POST /api/email/welcome
 * @access  Protected (auth required)
 */
const sendWelcomeEmailHandler = async (req, res, next) => {
    try {
        const { email, userName } = req.body;

        const emailResult = await sendWelcomeEmail(email, userName);

        if (!emailResult.success) {
            console.error('Failed to send welcome email:', emailResult.error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send welcome email. Please try again later.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Welcome email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ─── Contact Form ────────────────────────────────────────────────────────────

/**
 * @desc    Handle contact form submission
 * @route   POST /api/email/contact
 * @access  Public
 */
const handleContactForm = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        const emailResult = await sendContactFormEmail({ name, email, subject, message });

        if (!emailResult.success) {
            console.error('Failed to send contact form email:', emailResult.error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send your message. Please try again later.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    sendWelcomeEmailHandler,
    handleContactForm,
};
