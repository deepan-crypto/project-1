/**
 * Professional Email Templates
 * Centralized email template system for all application emails
 */

/**
 * Base email template wrapper
 * Provides consistent styling across all emails
 */
const baseEmailTemplate = (content, appName = 'Polling App') => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${appName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #45BFD0 0%, #2B9EB3 100%); padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    🗳️ ${appName}
                  </h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px; line-height: 1.5;">
                    This is an automated email from ${appName}.
                  </p>
                  <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                    Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Copyright -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="text-align: center; padding: 0 20px;">
                  <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                    © ${new Date().getFullYear()} ${appName}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Button component for consistent CTA buttons
 */
const buttonTemplate = (url, text, color = '#45BFD0') => {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a href="${url}" 
             style="display: inline-block; 
                    padding: 16px 40px; 
                    background-color: ${color}; 
                    color: #ffffff; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 16px;
                    box-shadow: 0 4px 6px rgba(69, 191, 208, 0.2);
                    transition: all 0.3s ease;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Alert box component for important notices
 */
const alertBox = (message, type = 'info') => {
    const colors = {
        info: { bg: '#e7f3ff', border: '#2196F3', text: '#0d47a1' },
        warning: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
        success: { bg: '#e8f5e9', border: '#4caf50', text: '#1b5e20' },
        danger: { bg: '#ffebee', border: '#f44336', text: '#b71c1c' }
    };

    const style = colors[type] || colors.info;

    return `
    <div style="background-color: ${style.bg}; 
                border-left: 4px solid ${style.border}; 
                padding: 16px 20px; 
                border-radius: 4px; 
                margin: 20px 0;">
      <p style="margin: 0; color: ${style.text}; font-size: 14px; line-height: 1.6;">
        ${message}
      </p>
    </div>
  `;
};

/**
 * Password Reset Email Template
 */
const passwordResetTemplate = (resetUrl, expiryHours = 1) => {
    const content = `
    <h2 style="margin: 0 0 20px; color: #212529; font-size: 24px; font-weight: 600;">
      Reset Your Password
    </h2>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Hi there! 👋
    </p>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password for your account:
    </p>
    
    ${buttonTemplate(resetUrl, 'Reset Your Password')}
    
    ${alertBox(`⏰ This link will expire in <strong>${expiryHours} hour${expiryHours > 1 ? 's' : ''}</strong> for security reasons.`, 'warning')}
    
    <p style="margin: 20px 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
      If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #dee2e6;">
      <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px; line-height: 1.6;">
        <strong>Security Tip:</strong> Never share your password or reset link with anyone.
      </p>
      <p style="margin: 0; color: #adb5bd; font-size: 12px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all; color: #45BFD0;">${resetUrl}</span>
      </p>
    </div>
  `;

    return baseEmailTemplate(content);
};

/**
 * Welcome Email Template
 */
const welcomeEmailTemplate = (userName, appUrl = '') => {
    const content = `
    <h2 style="margin: 0 0 20px; color: #212529; font-size: 24px; font-weight: 600;">
      Welcome to Polling App! 🎉
    </h2>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Thank you for joining our community! We're excited to have you on board.
    </p>
    
    ${alertBox('Your account has been successfully created and is ready to use! 🚀', 'success')}
    
    <h3 style="margin: 30px 0 15px; color: #212529; font-size: 18px; font-weight: 600;">
      What's Next?
    </h3>
    
    <ul style="margin: 0 0 20px; padding-left: 20px; color: #495057; font-size: 15px; line-height: 1.8;">
      <li>Create your first poll and share your thoughts</li>
      <li>Explore polls from other users</li>
      <li>Follow interesting users and stay updated</li>
      <li>Customize your profile to stand out</li>
    </ul>
    
    ${appUrl ? buttonTemplate(appUrl, 'Get Started Now') : ''}
    
    <p style="margin: 30px 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
      If you have any questions or need help, feel free to reach out to our support team.
    </p>
  `;

    return baseEmailTemplate(content);
};

/**
 * Account Verification Email Template
 */
const verificationEmailTemplate = (verificationUrl, userName) => {
    const content = `
    <h2 style="margin: 0 0 20px; color: #212529; font-size: 24px; font-weight: 600;">
      Verify Your Email Address
    </h2>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      To complete your registration and start using all features, please verify your email address by clicking the button below:
    </p>
    
    ${buttonTemplate(verificationUrl, 'Verify Email Address', '#4caf50')}
    
    ${alertBox('This verification link will expire in <strong>24 hours</strong>.', 'info')}
    
    <p style="margin: 20px 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
      If you didn't create an account with us, please ignore this email or contact our support team if you have concerns.
    </p>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #dee2e6;">
      <p style="margin: 0; color: #adb5bd; font-size: 12px;">
        If the button doesn't work, copy and paste this link:<br>
        <span style="word-break: break-all; color: #45BFD0;">${verificationUrl}</span>
      </p>
    </div>
  `;

    return baseEmailTemplate(content);
};

/**
 * Password Changed Confirmation Email Template
 */
const passwordChangedTemplate = (userName) => {
    const content = `
    <h2 style="margin: 0 0 20px; color: #212529; font-size: 24px; font-weight: 600;">
      Password Changed Successfully ✓
    </h2>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      This is a confirmation that your password has been successfully changed.
    </p>
    
    ${alertBox('Your account is now secured with your new password.', 'success')}
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px; color: #495057; font-size: 14px;">
        <strong>Security Details:</strong>
      </p>
      <p style="margin: 0; color: #6c757d; font-size: 13px; line-height: 1.6;">
        📅 Date: ${new Date().toLocaleString()}<br>
        🔐 Action: Password Reset
      </p>
    </div>
    
    ${alertBox(`<strong>⚠️ Didn't make this change?</strong><br>
                If you didn't reset your password, please contact our support team immediately to secure your account.`, 'danger')}
    
    <p style="margin: 30px 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
      Keep your account secure by using a strong, unique password and never sharing it with anyone.
    </p>
  `;

    return baseEmailTemplate(content);
};

/**
 * Login Notification Email Template
 */
const loginNotificationTemplate = (userName, location, device) => {
    const content = `
    <h2 style="margin: 0 0 20px; color: #212529; font-size: 24px; font-weight: 600;">
      New Login Detected
    </h2>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: #495057; font-size: 16px; line-height: 1.6;">
      We detected a new login to your account. If this was you, you can safely ignore this email.
    </p>
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 15px; color: #495057; font-size: 14px;">
        <strong>Login Details:</strong>
      </p>
      <table style="width: 100%; color: #6c757d; font-size: 13px;">
        <tr>
          <td style="padding: 5px 0;"><strong>Time:</strong></td>
          <td style="padding: 5px 0;">${new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Location:</strong></td>
          <td style="padding: 5px 0;">${location || 'Unknown'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Device:</strong></td>
          <td style="padding: 5px 0;">${device || 'Unknown'}</td>
        </tr>
      </table>
    </div>
    
    ${alertBox(`<strong>⚠️ Wasn't you?</strong><br>
                If you didn't log in, please reset your password immediately and contact our support team.`, 'danger')}
  `;

    return baseEmailTemplate(content);
};

module.exports = {
    passwordResetTemplate,
    welcomeEmailTemplate,
    verificationEmailTemplate,
    passwordChangedTemplate,
    loginNotificationTemplate,
    baseEmailTemplate,
    buttonTemplate,
    alertBox,
};
