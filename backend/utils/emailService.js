<<<<<<< HEAD
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #45BFD0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
=======
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
    // Create OAuth2 client
    const oauth2Client = createOAuth2Client();

    // Create Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'myapp://auth'}/reset-password?token=${resetToken}`;

    // HTML email template
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #45BFD0; margin: 0;">🗳️ ${process.env.APP_NAME || 'Polling App'}</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi there! We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 14px 30px; background-color: #45BFD0; color: white; 
                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Your Password
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; margin-top: 30px;">
            ⏰ This link will expire in <strong>1 hour</strong> for security reasons.
          </p>
          
          <p style="color: #888; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            This is an automated email from ${process.env.APP_NAME || 'Polling App'}. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

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

module.exports = {
  sendPasswordResetEmail,
>>>>>>> master
};
