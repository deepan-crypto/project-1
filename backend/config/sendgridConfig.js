const sgMail = require('@sendgrid/mail');

/**
 * SendGrid Configuration
 * Initializes the SendGrid mail client with API key validation
 */

const initSendGrid = () => {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY is not set in environment variables');
        console.error('   Email functionality will be disabled.');
        return false;
    }

    if (!apiKey.startsWith('SG.')) {
        console.error('❌ SENDGRID_API_KEY appears to be invalid (should start with "SG.")');
        return false;
    }

    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized successfully');
    console.log(`   From: ${process.env.SENDGRID_FROM_NAME || 'Thoughts'} <${process.env.SENDGRID_FROM_EMAIL || 'noreply@thoughts.co.in'}>`);
    return true;
};

/**
 * Get the configured sender info
 * @returns {{ email: string, name: string }}
 */
const getSender = () => ({
    email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thoughts.co.in',
    name: process.env.SENDGRID_FROM_NAME || 'Thoughts',
});

module.exports = { initSendGrid, getSender, sgMail };
