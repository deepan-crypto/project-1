const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { getSESClient, getSender } = require('../config/sesConfig');

/**
 * AWS SES Email Service
 * Production-grade email sending with retry logic, error classification, and structured logging.
 * Drop-in replacement for the previous SendGrid service — same exported API surface.
 */

// ─── Base Send Function ──────────────────────────────────────────────────────

/**
 * Send an email via AWS SES with retry logic and exponential backoff
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 * @param {Object} [options.replyTo] - Reply-to address { email, name }
 * @param {number} [retries=2] - Number of retries on transient failures
 * @returns {Promise<Object>} Result with success status and message ID
 */
const sendEmail = async ({ to, subject, html, text, replyTo }, retries = 2) => {
    const sender = getSender();
    const sesClient = getSESClient();

    const params = {
        Source: `${sender.name} <${sender.email}>`,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: html,
                },
                ...(text && {
                    Text: {
                        Charset: 'UTF-8',
                        Data: text,
                    },
                }),
            },
        },
        ...(replyTo && {
            ReplyToAddresses: [
                typeof replyTo === 'string'
                    ? replyTo
                    : replyTo.name
                        ? `${replyTo.name} <${replyTo.email}>`
                        : replyTo.email,
            ],
        }),
    };

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const command = new SendEmailCommand(params);
            const response = await sesClient.send(command);

            console.log(`✅ Email sent successfully`);
            console.log(`   To: ${to}`);
            console.log(`   Subject: ${subject}`);
            console.log(`   SES Message-ID: ${response.MessageId || 'N/A'}`);

            return {
                success: true,
                messageId: response.MessageId || null,
            };
        } catch (error) {
            const errorCode = error.name || error.Code || 'UnknownError';
            const statusCode = error.$metadata?.httpStatusCode;

            console.error(`❌ Email send attempt ${attempt}/${retries + 1} failed`);
            console.error(`   To: ${to}`);
            console.error(`   Subject: ${subject}`);
            console.error(`   Error Code: ${errorCode}`);
            console.error(`   HTTP Status: ${statusCode || 'N/A'}`);
            console.error(`   Message: ${error.message}`);

            // Don't retry on client/permanent errors
            if (isNonRetryableError(errorCode, statusCode)) {
                return {
                    success: false,
                    errorCode,
                    error: classifyError(errorCode, error.message),
                };
            }

            // Retry on transient/server errors
            if (attempt <= retries) {
                const delay = Math.pow(2, attempt) * 500; // 1s, 2s
                console.log(`   ⏳ Retrying in ${delay}ms...`);
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
 * Determine if an SES error should NOT be retried
 * @param {string} errorCode - AWS error code name
 * @param {number} [statusCode] - HTTP status code
 * @returns {boolean}
 */
const isNonRetryableError = (errorCode, statusCode) => {
    const permanentErrors = [
        'MessageRejected',
        'MailFromDomainNotVerifiedException',
        'ConfigurationSetDoesNotExistException',
        'AccountSendingPausedException',
        'InvalidParameterValue',
        'ValidationError',
    ];
    if (permanentErrors.includes(errorCode)) return true;
    if (statusCode && statusCode >= 400 && statusCode < 500) return true;
    return false;
};

/**
 * Classify SES errors into user-friendly messages
 * @param {string} errorCode - AWS error code
 * @param {string} message - Raw error message
 * @returns {string} User-friendly error message
 */
const classifyError = (errorCode, message) => {
    switch (errorCode) {
        case 'MessageRejected':
            return 'Email was rejected by the mail service. Please verify the recipient address.';
        case 'MailFromDomainNotVerifiedException':
            return 'Sender domain is not verified. Contact support.';
        case 'AccountSendingPausedException':
            return 'Email sending is temporarily paused. Please try again later.';
        case 'Throttling':
        case 'TooManyRequestsException':
            return 'Email rate limit exceeded. Please try again later.';
        case 'InvalidParameterValue':
            return 'Invalid email parameters provided.';
        case 'ConfigurationSetDoesNotExistException':
            return 'Email configuration error. Contact support.';
        case 'InvalidClientTokenId':
        case 'UnrecognizedClientException':
            return 'Email service authentication failed. Contact support.';
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
