const { SESClient, GetAccountCommand } = require('@aws-sdk/client-ses');

/**
 * AWS SES Configuration
 * Initializes the SES client with credentials and region validation.
 * Compatible with PM2 + EC2 production environments.
 */

let sesClient = null;

/**
 * Initialize the SES client
 * Validates required environment variables and verifies connectivity.
 * @returns {Promise<boolean>} True if initialization succeeded
 */
const initSES = async () => {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    // ── Validate required env vars ──────────────────────────────────────────
    const missing = [];
    if (!region) missing.push('AWS_REGION');
    if (!accessKeyId) missing.push('AWS_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY');
    if (!process.env.SES_FROM_EMAIL) missing.push('SES_FROM_EMAIL');

    if (missing.length > 0) {
        console.error(`❌ Missing required SES environment variables: ${missing.join(', ')}`);
        console.error('   Email functionality will be disabled.');
        return false;
    }

    // ── Create SES client ───────────────────────────────────────────────────
    sesClient = new SESClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        // Production-grade: respect socket/connection timeouts
        requestHandler: undefined, // use default Node.js HTTP handler
    });

    // ── Verify connectivity (non-blocking — log only) ───────────────────────
    try {
        const command = new GetAccountCommand({});
        await sesClient.send(command);
        console.log('✅ AWS SES initialized successfully');
        console.log(`   Region: ${region}`);
        console.log(`   From: ${process.env.SES_FROM_NAME || 'Thoughts'} <${process.env.SES_FROM_EMAIL}>`);
        return true;
    } catch (error) {
        // SES might still work even if GetAccount fails (permissions issue)
        // Log warning but don't block startup
        if (error.name === 'AccessDeniedException') {
            console.warn('⚠️  AWS SES initialized (GetAccount permission denied — sending may still work)');
            console.log(`   Region: ${region}`);
            console.log(`   From: ${process.env.SES_FROM_NAME || 'Thoughts'} <${process.env.SES_FROM_EMAIL}>`);
            return true;
        }
        console.error('❌ AWS SES initialization failed:', error.message);
        return false;
    }
};

/**
 * Get the SES client instance
 * @returns {SESClient} The initialized SES client
 * @throws {Error} If SES has not been initialized
 */
const getSESClient = () => {
    if (!sesClient) {
        throw new Error('SES client not initialized. Call initSES() first.');
    }
    return sesClient;
};

/**
 * Get the configured sender info from environment
 * @returns {{ email: string, name: string }}
 */
const getSender = () => ({
    email: process.env.SES_FROM_EMAIL || 'noreply@thoughts.co.in',
    name: process.env.SES_FROM_NAME || 'Thoughts',
});

module.exports = { initSES, getSESClient, getSender };
