const { sgMail, getSender } = require('../config/sendgridConfig');

/**
 * SendGrid Email Service
 * Production-grade email sending with retry logic, error classification, and structured logging
 */

// ─── Base Send Function ──────────────────────────────────────────────────────

/**
 * Send an email via SendGrid with retry logic
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 * @param {Object} [options.replyTo] - Reply-to address
 * @param {number} [retries=2] - Number of retries on transient failures
 * @returns {Promise<Object>} Result with success status and message ID
 */
const sendEmail = async ({ to, subject, html, text, replyTo }, retries = 2) => {
    const sender = getSender();

    const msg = {
        to,
        from: {
            email: sender.email,
            name: sender.name,
        },
        subject,
        html,
        ...(text && { text }),
        ...(replyTo && { replyTo }),
    };

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const [response] = await sgMail.send(msg);

            console.log(`✅ Email sent successfully`);
            console.log(`   To: ${to}`);
            console.log(`   Subject: ${subject}`);
            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Message-ID: ${response.headers['x-message-id'] || 'N/A'}`);

            return {
                success: true,
                statusCode: response.statusCode,
                messageId: response.headers['x-message-id'] || null,
            };
        } catch (error) {
            const statusCode = error.code || error.response?.statusCode;
            const errorBody = error.response?.body;

            console.error(`❌ Email send attempt ${attempt}/${retries + 1} failed`);
            console.error(`   To: ${to}`);
            console.error(`   Subject: ${subject}`);
            console.error(`   Status: ${statusCode}`);
            console.error(`   Error: ${error.message}`);

            if (errorBody?.errors) {
                errorBody.errors.forEach((e, i) => {
                    console.error(`   Error[${i}]: ${e.message} (field: ${e.field})`);
                });
            }

            // Don't retry on client errors (4xx) — they won't succeed on retry
            if (statusCode && statusCode >= 400 && statusCode < 500) {
                return {
                    success: false,
                    statusCode,
                    error: classifyError(statusCode, error.message),
                };
            }

            // Retry on server errors (5xx) or network errors
            if (attempt <= retries) {
                const delay = Math.pow(2, attempt) * 500; // Exponential backoff: 1s, 2s
                console.log(`   Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    return {
        success: false,
        error: 'Failed to send email after all retries. Please try again later.',
    };
};

/**
 * Classify SendGrid errors into user-friendly messages
 */
const classifyError = (statusCode, message) => {
    switch (statusCode) {
        case 401:
            return 'Email service authentication failed. Please check the API key.';
        case 403:
            return 'Email service access denied. Verify sender authentication in SendGrid.';
        case 413:
            return 'Email content is too large.';
        case 429:
            return 'Email rate limit exceeded. Please try again later.';
        default:
            return message || 'Failed to send email.';
    }
};

// ─── Email Sending Functions ─────────────────────────────────────────────────

/**
 * Send OTP verification email
 * @param {string} email - Recipient email address
 * @param {string} otp - The OTP code
 * @param {number} [expiryMinutes=10] - OTP expiry in minutes
 * @returns {Promise<Object>}
 */
const sendOtpEmail = async (email, otp, expiryMinutes = 10) => {
    const { otpEmailTemplate } = require('./emailTemplates');

    const html = otpEmailTemplate(otp, expiryMinutes);
    const appName = process.env.APP_NAME || 'Thoughts';

    return sendEmail({
        to: email,
        subject: `${otp} is your ${appName} verification code`,
        html,
        text: `Your verification code is: ${otp}. It expires in ${expiryMinutes} minutes. Do not share this code with anyone.`,
    });
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
    const { passwordResetTemplate } = require('./emailTemplates');

    const resetUrl = `${process.env.FRONTEND_URL || 'myapp://auth'}/reset-password?token=${resetToken}`;
    const html = passwordResetTemplate(resetUrl, 1); // 1 hour expiry
    const appName = process.env.APP_NAME || 'Thoughts';

    return sendEmail({
        to: email,
        subject: `Password Reset Request - ${appName}`,
        html,
        text: `You requested a password reset. Use this link to reset your password: ${resetUrl}. This link expires in 1 hour.`,
    });
};

/**
 * Send welcome email to new users
 * @param {string} email - Recipient email address
 * @param {string} userName - User's display name
 * @returns {Promise<Object>}
 */
const sendWelcomeEmail = async (email, userName) => {
    const { welcomeEmailTemplate } = require('./emailTemplates');

    const appUrl = process.env.FRONTEND_URL || 'myapp://';
    const html = welcomeEmailTemplate(userName, appUrl);
    const appName = process.env.APP_NAME || 'Thoughts';

    return sendEmail({
        to: email,
        subject: `Welcome to ${appName}! 🎉`,
        html,
        text: `Welcome to ${appName}, ${userName}! Your account has been created successfully.`,
    });
};

/**
 * Send password changed confirmation email
 * @param {string} email - Recipient email address
 * @param {string} userName - User's display name
 * @returns {Promise<Object>}
 */
const sendPasswordChangedEmail = async (email, userName) => {
    const { passwordChangedTemplate } = require('./emailTemplates');

    const html = passwordChangedTemplate(userName);
    const appName = process.env.APP_NAME || 'Thoughts';

    return sendEmail({
        to: email,
        subject: `Password Changed - ${appName}`,
        html,
        text: `Hi ${userName}, your password has been changed successfully. If you didn't do this, please contact support immediately.`,
    });
};

/**
 * Send contact form email to admin
 * @param {Object} formData
 * @param {string} formData.name - Sender name
 * @param {string} formData.email - Sender email
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message body
 * @returns {Promise<Object>}
 */
const sendContactFormEmail = async ({ name, email, subject, message }) => {
    const { contactFormTemplate } = require('./emailTemplates');

    const adminEmail = process.env.CONTACT_FORM_TO_EMAIL || 'support@thoughts.co.in';
    const html = contactFormTemplate(name, email, subject, message);
    const appName = process.env.APP_NAME || 'Thoughts';

    return sendEmail({
        to: adminEmail,
        subject: `[${appName} Contact] ${subject}`,
        html,
        text: `Contact form submission from ${name} (${email}):\n\nSubject: ${subject}\n\n${message}`,
        replyTo: { email, name },
    });
};

module.exports = {
    sendEmail,
    sendOtpEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendPasswordChangedEmail,
    sendContactFormEmail,
};
