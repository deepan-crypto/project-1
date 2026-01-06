const { google } = require('googleapis');

/**
 * Gmail OAuth2 Email Service
 * Sends emails using Gmail API with OAuth2 authentication
 */

// OAuth2 Client Configuration
const createOAuth2Client = () => {
  const OAuth2 = google.auth.OAuth2;

  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI used to get tokens
  );

  // Set credentials with refresh token
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return oauth2Client;
};

/**
 * Create email in RFC 2822 format
 */
const createEmailMessage = (to, subject, htmlContent) => {
  const from = process.env.GMAIL_USER || 'noreply@pollingapp.com';
  const appName = process.env.APP_NAME || 'Polling App';

  const email = [
    `From: "${appName}" <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlContent,
  ].join('\n');

  // Encode in base64url format
  const encodedMessage = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return encodedMessage;
};

/**
 * Send password reset email via Gmail API
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Result object with success status
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const { passwordResetTemplate } = require('./emailTemplates');

    // Create OAuth2 client
    const oauth2Client = createOAuth2Client();

    // Create Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'myapp://auth'}/reset-password?token=${resetToken}`;

    // Use professional email template
    const htmlContent = passwordResetTemplate(resetUrl, 1); // 1 hour expiry

    // Create RFC 2822 formatted email
    const encodedMessage = createEmailMessage(
      email,
      `Password Reset Request - ${process.env.APP_NAME || 'Polling App'}`,
      htmlContent
    );

    // Send email via Gmail API
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Password reset email sent successfully via Gmail API:', response.data.id);
    return {
      success: true,
      messageId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to send password reset email via Gmail API:', error);

    // Handle specific Gmail API errors
    if (error.code === 401 || error.code === 403) {
      return {
        success: false,
        error: 'Gmail authentication failed. Please check OAuth2 credentials and refresh token.',
      };
    } else if (error.message?.includes('invalid_grant') || error.message?.includes('invalid_client')) {
      return {
        success: false,
        error: 'Gmail refresh token expired or invalid. Please regenerate the refresh token using OAuth Playground.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Send welcome email to new users
 * @param {string} email - Recipient email address
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Result object with success status
 */
const sendWelcomeEmail = async (email, userName) => {
  try {
    const { welcomeEmailTemplate } = require('./emailTemplates');

    const oauth2Client = createOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const appUrl = process.env.FRONTEND_URL || 'myapp://';
    const htmlContent = welcomeEmailTemplate(userName, appUrl);

    const encodedMessage = createEmailMessage(
      email,
      `Welcome to ${process.env.APP_NAME || 'Polling App'}! 🎉`,
      htmlContent
    );

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Welcome email sent successfully:', response.data.id);
    return {
      success: true,
      messageId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Send password changed confirmation email
 * @param {string} email - Recipient email address
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Result object with success status
 */
const sendPasswordChangedEmail = async (email, userName) => {
  try {
    const { passwordChangedTemplate } = require('./emailTemplates');

    const oauth2Client = createOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const htmlContent = passwordChangedTemplate(userName);

    const encodedMessage = createEmailMessage(
      email,
      `Password Changed - ${process.env.APP_NAME || 'Polling App'}`,
      htmlContent
    );

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Password changed email sent successfully:', response.data.id);
    return {
      success: true,
      messageId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to send password changed email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
};
