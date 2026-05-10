/**
 * AWS SES Test Script
 * Run: node utils/testSes.js
 *
 * Tests SES connectivity and sends a test email to verify the full pipeline.
 * Requires .env to be properly configured.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { initSES } = require('../config/sesConfig');
const { sendEmail } = require('./emailService');

const TEST_RECIPIENT = process.argv[2]; // pass recipient as CLI arg

const run = async () => {
    console.log('\n🔧 AWS SES Integration Test');
    console.log('═'.repeat(50));

    // Step 1: Check environment variables
    console.log('\n📋 Step 1: Checking environment variables...');
    const vars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'SES_FROM_EMAIL'];
    let allPresent = true;
    vars.forEach(v => {
        const present = !!process.env[v];
        console.log(`   ${present ? '✅' : '❌'} ${v}: ${present ? 'Set' : 'MISSING'}`);
        if (!present) allPresent = false;
    });
    if (!allPresent) {
        console.error('\n❌ Missing environment variables. Aborting.');
        process.exit(1);
    }

    // Step 2: Initialize SES client
    console.log('\n📋 Step 2: Initializing SES client...');
    const initialized = await initSES();
    if (!initialized) {
        console.error('\n❌ SES initialization failed. Aborting.');
        process.exit(1);
    }

    // Step 3: Send test email (only if recipient provided)
    if (!TEST_RECIPIENT) {
        console.log('\n📋 Step 3: Skipped (no recipient provided)');
        console.log('   Usage: node utils/testSes.js your-email@example.com');
        console.log('\n✅ SES configuration is valid! Ready to send emails.');
        process.exit(0);
    }

    console.log(`\n📋 Step 3: Sending test email to ${TEST_RECIPIENT}...`);
    const result = await sendEmail({
        to: TEST_RECIPIENT,
        subject: '🧪 SES Test Email — Thoughts',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #45BFD0;">✅ SES is Working!</h2>
                <p>This test email confirms that your AWS SES integration is configured correctly.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #888; font-size: 12px;">
                    Sent at: ${new Date().toISOString()}<br>
                    Region: ${process.env.AWS_REGION}<br>
                    From: ${process.env.SES_FROM_NAME} &lt;${process.env.SES_FROM_EMAIL}&gt;
                </p>
            </div>
        `,
        text: 'SES is working! This test email confirms your AWS SES integration is configured correctly.',
    });

    if (result.success) {
        console.log(`\n✅ Test email sent successfully!`);
        console.log(`   Message ID: ${result.messageId}`);
    } else {
        console.error(`\n❌ Test email failed: ${result.error}`);
        process.exit(1);
    }

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 All SES tests passed!\n');
};

run().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
